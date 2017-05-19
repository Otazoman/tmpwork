//-------------------------------------------------------------------
// 案件登録用モジュール
//  2013/5/30  Ver1.0    Created By M.Nishimura
//
//  機能：案件マスタ(行動計画に沿った案件)登録画面制御等を行う
//-------------------------------------------------------------------
// 追加ボタン押下時に画面要素を追加する。
onload = init;
onunload = dbClose;
var ItemField = {
    //div要素の中で最大のitemNOを取得してcurrentNumberにセットする。
    currentNumber: 0,
    itemTemplate: '案件ID　:<input type="text" name="txtMatterCd__count__" id="txtMatterCd__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="" \/>' + '案件　　:<input type="text" name="txtMatter__count__" id="txtMatter__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="" \/>' + '概要　　:<textarea name="txtMatterMemo__count__" id="txtMatterMemo__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"><\/textarea>' + '<input type="button" name="btnInsert__count__" id="btnInsert__count__" value="登録" onclick="dataInsert(txtMatterCd__count__.value,txtMatter__count__.value,txtMatterMemo__count__.value,__count__)" \/>' + '<input type="button" name="btnUpdate__count__" id="btnUpdate__count__" value="更新" onclick="dataUpdate(txtMatterCd__count__.value,txtMatter__count__.value,txtMatterMemo__count__.value,__count__)" \/>' + '<input type="button" name="btnDelete__count__" id="btnDelete__count__" value="削除" onclick="dataDelete(txtMatterCd__count__.value,__count__)" \/>',
    add: function() {
        //テキストボックスの最後の要素番号取得
        var eleNumber = document.getElementsByTagName("div").length - 1;
        this.currentNumber = eleNumber;
        //テキストフィールド追加
        this.currentNumber++;
        var field = document.getElementById('item' + this.currentNumber);
        var newItem = this.itemTemplate.replace(/__count__/mg, this.currentNumber);
        field.innerHTML = newItem;
        var nextNumber = this.currentNumber + 1;
        var new_area = document.createElement("div");
        new_area.setAttribute("id", "item" + nextNumber);
        field.appendChild(new_area);
        //テキストボックス追加時に案件IDにフォーカス
        var nxtfield = document.getElementById('txtMatterCd' + this.currentNumber);
        //最新テキストボックスにテキストボックスに表示されているID+1の値を表示する。
        nxtfield.value = this.currentNumber;
        //案件セレクトボックスにフォーカス移動

        nxtfield.focus();
    },
    remove: function() {
        var chkCdTxtbox = document.getElementById('txtMatterCd' + this.currentNumber);
        var chkDeTxtbox = document.getElementById('txtMatter' + this.currentNumber);
        if (this.currentNumber == 0) {
            return;
        }
        //入力データ存在時はテキストボックス削除不可
        if (chkCdTxtbox.value == "" && chkDeTxtbox.value == '') {
            //テキストフィールド削除
            var field = document.getElementById('item' + this.currentNumber);
            field.removeChild(field.lastChild);
            field.innerHTML = '';
            this.currentNumber--;
            //テキストボックス削除時に案件IDにフォーカス
            var beforefield = document.getElementById('txtMatterCd' + this.currentNumber);
            if (this.currentNumber == 0) {
                return;
            } //最終行除外
            beforefield.focus();
        } else {
            alert("入力データが存在します");
            var currentfield = document.getElementById('txtMatterCd' + this.currentNumber);
            currentfield.focus();
        }
    },
    clear: function() {
        var clNumber = document.getElementsByTagName("div").length - 1;
        this.currentNumber = clNumber;
        var clfield = document.getElementById('item' + this.currentNumber);
        clfield.removeChild(clfield.lastChild);
        clfield.innerHTML = '';
        this.currentNumber--;
        var clfield = document.getElementById('item' + this.currentNumber);
        if (this.currentNumber == 0) {
            return;
        } //最終行除外
        clfield.removeChild(clfield.lastChild);
    }
}

function init() {
    //初期設定をする関数
    resizeTo(1000, 640);
    document.getElementById("linkLogOut").onclick = function() {
        OperateEnd();
    }
    document.getElementById("ActionPlanReload").onclick = function() {
        ActionPlanCdDisplay();
    }
    document.getElementById("MakeFolder").onclick = function () {
        MatterFolderMake();
    }
    dbConnect(); //データベース接続
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //登録用日時取得
    OperateDate = dateFormat.format(new Date());
    // データベースからレコード数を取得し必要な数量のテキストボックスを表示して値を表示する
    ActionPlanCdDisplay();
    defaultselect();
}

function OperateEnd() {
    //終了処理
    dbClose();
    (window.open('', '_self').opener = window).close();
}
//*****************************************************************************
//
// データ操作関連
//
//******************************************************************************
function dataCount(AdministrationID, ActionPlanID) {
    //行動計画に紐付く案件件数カウント
    var AdminID = AdministrationID;
    var ActionID = ActionPlanID;
    var mySql = " SELECT Count(m_Matter.MatterID) AS MatterCount "
                 + " FROM (m_Businessyear INNER JOIN (m_Matter INNER JOIN m_Administration ON m_Matter.AdministrationID = m_Administration.AdministrationID)"
                 + " ON m_Businessyear.BusinessYear = m_Administration.Businessyear) INNER JOIN m_ActionPlan"
                 + " ON (m_Matter.ActionplanID = m_ActionPlan.ActionplanID)" + " AND (m_Administration.AdministrationID = m_ActionPlan.AdministrationID)"
                 + " WHERE (((m_Matter.AdministrationID)='" + AdminID + "')" + " AND ((m_Matter.ActionplanID)='" + ActionID + "')" + " AND (m_Businessyear.ShowFlg='0') AND ((m_Administration.DeleteFlg) Is Null)"
                 + " AND ((m_ActionPlan.DeleteFlg) Is Null) AND ((m_Matter.DeleteFlg) Is Null));";
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
    return idcount;
}

function dataDisplay(AdministrationID, ActionPlanID) {
    try {
        //データを表示する関数
        var AdminID = AdministrationID;
        var ActionID = ActionPlanID;
        var mySql = " SELECT m_Matter.AdministrationID, m_Matter.ActionplanID, m_Matter.MatterID, m_Matter.MatterName , m_Matter.MatterMemo"
                     + " FROM (m_Businessyear INNER JOIN (m_Matter INNER JOIN m_Administration ON m_Matter.AdministrationID = m_Administration.AdministrationID) "
                     + " ON m_Businessyear.BusinessYear = m_Administration.Businessyear) "
                     + " INNER JOIN m_ActionPlan ON (m_ActionPlan.AdministrationID = m_Administration.AdministrationID) " + " AND (m_Matter.ActionplanID = m_ActionPlan.ActionplanID) "
                     + " WHERE (((m_Matter.AdministrationID)='" + AdminID + "')  AND " + " ((m_Matter.ActionplanID)='" + ActionID + "') AND "
                     + " (m_Businessyear.ShowFlg='0') AND ((m_Administration.DeleteFlg) Is Null) "
                     + " AND ((m_ActionPlan.DeleteFlg) Is Null) AND ((m_Matter.DeleteFlg) Is Null));";
        var recordSet = database.Execute(mySql);
        var counter = 1;
        var tempHtml = "";
        while (!recordSet.EOF) {
            tempHtml = '案件ID　:<input type="text" name="txtMatterCd' + counter + '" id="txtMatterCd' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(2) + '" \/>' + '案件　　:<input type="text" name="txtMatter' + counter + '" id="txtMatter' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="' + recordSet(3) + '" \/>' + '概要　　:<textarea name="txtMatterMemo' + counter + '" id="txtMatterMemo' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">' + recordSet(4) + '<\/textarea>' + '<input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="登録" onclick="dataInsert(txtMatterCd' + counter + '.value,txtMatter' + counter + '.value,txtMatterMemo' + counter + '.value,' + counter + ')" \/>' + '<input type="button" name="btnUpdate' + counter + '" id="btnUpdate' + counter + '" value="更新" onclick="dataUpdate(txtMatterCd' + counter + '.value,txtMatter' + counter + '.value,txtMatterMemo' + counter + '.value,' + counter + ')" \/>' + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="削除" onclick="dataDelete(txtMatterCd' + counter + '.value,' + counter + ')" \/>';
            var field = document.getElementById('item' + counter);
            var newItem = tempHtml;
            field.innerHTML = newItem;
            var nextNumber = counter + 1;
            var new_area = document.createElement("div");
            new_area.setAttribute("id", "item" + nextNumber);
            field.appendChild(new_area);
            recordSet.MoveNext();
            counter++;
        }
        recordSet.Close();
        recordSet = null;
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataInsert(MatterCd, Matter, MatterMemo, txtCount) {
    //データを追加する関数
    var ADcdfield = document.getElementById('AdministrationCd').innerText;
    var workCd = document.getElementById('selectActionPlan').value;
    var ACcdfield = StringSeparator(workCd);
    try {
        var Chkcount = txtCount;
        if (dataCheck(MatterCd, 0, Chkcount) && dataCheck(Matter, 1, Chkcount)) {
            var mySql = " INSERT INTO m_Matter ( AdministrationID, ActionplanID, MatterID ,MatterName , MatterMemo , Creationdate ) VALUES "
                         + "('" + ADcdfield + "','" + ACcdfield + "','" + MatterCd + "','" + Matter + "','" + MatterMemo + "','" + OperateDate + "');";
            //      console.log(mySql);
            database.Execute(mySql);
            alert("追加しました。");
            dataDisplay(ADcdfield, ACcdfield);
            ItemField.add();
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataUpdate(MatterCd, Matter, MatterMemo, txtCount) {
    //データを更新する関数
    var ADcdfield = document.getElementById('AdministrationCd').innerText;
    var workCd = document.getElementById('selectActionPlan').value;
    var ACcdfield = StringSeparator(workCd);
    try {
        var Chkcount = txtCount;
        if (dataCheck(MatterCd, 0, Chkcount) && dataCheck(Matter, 1, Chkcount)) {
            var mySql = " UPDATE m_Matter SET MatterID ='" + MatterCd + "', MatterName = '" + Matter + "', MatterMemo = '" + MatterMemo + "', UpdateDate = '" + OperateDate + "'" + " WHERE ( MatterID = '" + MatterCd + "' ) AND ( ActionPlanId = '" + ACcdfield + "' )  AND ( AdministrationID = '" + ADcdfield + "' );";
            //      console.log(mySql);
            database.Execute(mySql);
            alert("更新しました。");
            dataDisplay(ADcdfield, ACcdfield);
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataDelete(MatterCd, txtCount) {
    //データを削除する関数
    var ADcdfield = document.getElementById('AdministrationCd').innerText;
    var workCd = document.getElementById('selectActionPlan').value;
    var ACcdfield = StringSeparator(workCd);
    try {
        var Chkcount = txtCount;
        if (dataCheck(MatterCd, 0, Chkcount)) {
            var mySql = " UPDATE m_Matter SET DeleteFlg = '1', DeleteDate = '" + OperateDate + "' WHERE ( MatterID = '" + MatterCd + "' ) AND ( ActionPlanId = '" + ACcdfield + "' )  AND ( AdministrationID = '" + ADcdfield + "' );";
            //      console.log(mySql);
            database.Execute(mySql);
            alert("削除しました。");
            ItemField.clear()
            dataDisplay(ADcdfield, ACcdfield);
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function ActionPlanCdDisplay() {
    //行動計画IDをセレクトボックスに表示する関数
    var mySql = "SELECT m_ActionPlan.AdministrationID, m_ActionPlan.ActionplanID, m_ActionPlan.ActionPlan "
                 + " FROM (m_ActionPlan INNER JOIN m_Administration ON " + " m_ActionPlan.AdministrationID = m_Administration.AdministrationID) "
                 + " INNER JOIN m_Businessyear ON " + " m_Administration.Businessyear = m_Businessyear.BusinessYear "
                 + " WHERE ((m_ActionPlan.DeleteFlg) Is Null) AND (m_Businessyear.ShowFlg='0')  ORDER BY m_ActionPlan.AdministrationID,m_ActionPlan.ActionplanID ;";
    var recordSet = database.Execute(mySql);
    document.getElementById("ActionPlanCdDisplay").innerHTML = "";
    var tempHtml = "行動計画：　<select name=\"selectActionPlan\" id=\"selectActionPlan\">\n";
    tempHtml = tempHtml + "\t<option value=\"0\">選択してください。</option>\n";
    while (!recordSet.EOF) {
        tempHtml = tempHtml + "\t<option value=\"" + recordSet(0) + "-" + recordSet(1) + "\">" + recordSet(0) + "-" + recordSet(1) + "：" + recordSet(2) + "</option>\n";
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + "</select>";
    //	console.log(tempHtml);
    document.getElementById("ActionPlanCdDisplay").innerHTML = tempHtml;
    selectActionPlan = document.getElementById("selectActionPlan");
    selectActionPlan.onchange = function() {
        ActionPlanCdchange(this);
    }
    recordSet.Close();
    recordSet = null;
}

function ActionPlanCdchange(obj) {
    //セレクトボックス更新時の画面制御
    //基本方針CDと行動計画CDを分割する。
    //参照元　https://developer.mozilla.org/ja/docs/JavaScript/Reference/Global_Objects/String/split
    //
    var workCd = obj.value;
    var separator = "-";
    var allayworkCd = workCd.split(separator);
    if (obj.selectedIndex == 0) {
        var seladmin = document.getElementById("selectActionPlan");
        alert("行動計画を選択してください。");
        seladmin.focus();
        return;
    }
    var AdministrationCd = allayworkCd[0];
    var ActionPlanCd = allayworkCd[1];
    var mySql = " SELECT m_ActionPlan.AdministrationID, m_Administration.AdministrationDetail, m_ActionPlan.ActionplanID, m_ActionPlan.ActionPlan "
                + " FROM (m_ActionPlan INNER JOIN m_Administration ON " + " m_ActionPlan.AdministrationID = m_Administration.AdministrationID) "
                + " INNER JOIN m_Businessyear ON " + " m_Administration.Businessyear = m_Businessyear.BusinessYear "
                + " WHERE ((m_ActionPlan.[AdministrationID])='" + AdministrationCd + "') "
                + " AND ((m_ActionPlan.[ActionplanID])='" + ActionPlanCd + "') AND ((m_ActionPlan.[DeleteFlg]) Is Null) "
                + " AND (m_Businessyear.ShowFlg='0');"
    var recordSet = database.Execute(mySql);
    var sk1 = recordSet(0); //基本方針ID
    var sk2 = recordSet(2); //行動計画ID
    document.getElementById("AdministrationCdDisplay").innerHTML = "";
    var tempHtml = "基本方針：　<span id=\"AdministrationCd\">" + recordSet(0) + "</span>" + "<span id=\"Administration\">" + recordSet(1) + "</span>";
    document.getElementById("AdministrationCdDisplay").innerHTML = tempHtml;
    var counter = dataCount(sk1, sk2);
    if (counter == 0) {
        //0件の場合は画面をクリアする。
        var clfield = document.getElementById('item1');
        //子オブジェクトが取得可能な場合は子ツリーを削除してテキストボックス追加
        if (clfield.lastchild) {
            ItemField.clear()
            clfield.removeChild(clfield.lastChild);
            clfield.innerHTML = '';
            ItemField.add();
        }
        //子オブジェクト取得不可の場合は子オブジェクトを無視してテキストボックス追加
        clfield.innerHTML = '';
        ItemField.add();
    } else {
        dataDisplay(sk1, sk2);
        ItemField.add();
    }
    recordSet.Close();
    recordSet = null;
}

function defaultselect() {
//セレクトボックスにデフォルト値をセットする。
    var selcounter = document.getElementsByTagName("option").length - 1
    var selyearop = document.getElementById("selectActionPlan");
    selyearop.options[selcounter].selected = true;
    ActionPlanCdchange(selyearop.options[selcounter]);
}
//*****************************************************************************
//
// フォルダ作成関連
//
//******************************************************************************
function MatterFolderMake() {
    var myObject = new ActiveXObject("Scripting.FileSystemObject");
    //ローカル検証用
    //var fpath = "C:\\Users\\nishimuram\\Desktop\\新しいフォルダー\\";
    //ファイルサーバでの作成用
    var fpath = "\\\\fs2010\\29_情報システム(専用）\\90_一時使用\\99_案件フォルダ作成用\\";
    try {
        //レコード件数カウント
        var mySql =" SELECT Count(m_Matter.MatterID) AS MaCount"
                    + " FROM m_Businessyear INNER JOIN (m_ActionPlan INNER JOIN (m_Matter INNER JOIN m_Administration ON m_Matter.AdministrationID = m_Administration.AdministrationID)"
                    + " ON (m_ActionPlan.AdministrationID = m_Administration.AdministrationID) AND (m_ActionPlan.ActionplanID = m_Matter.ActionplanID))"
                    + " ON m_Businessyear.BusinessYear = m_Administration.Businessyear"
                    + " WHERE (((m_Businessyear.ShowFlg)='0') AND ((m_Administration.DeleteFlg) Is Null) AND ((m_ActionPlan.DeleteFlg) Is Null) "
                    + " AND ((m_Matter.DeleteFlg) Is Null));";
        var crecordSet = database.Execute(mySql);
        var ReportCount = crecordSet(0);
        //レコード存在時のみ処理
        if (ReportCount != 0) {
            var mySql = "SELECT m_Businessyear.BusinessYear, m_Matter.AdministrationID, m_Matter.ActionplanID, m_Matter.MatterID, m_Matter.MatterName "
                        + " FROM m_Businessyear INNER JOIN (m_ActionPlan INNER JOIN (m_Matter INNER JOIN m_Administration ON "
                        + " m_Matter.AdministrationID = m_Administration.AdministrationID) ON (m_ActionPlan.AdministrationID = m_Administration.AdministrationID) "
                        + " AND (m_ActionPlan.ActionplanID = m_Matter.ActionplanID)) ON m_Businessyear.BusinessYear = m_Administration.Businessyear "
                        + " WHERE (((m_Businessyear.ShowFlg)='0') AND ((m_Administration.DeleteFlg) Is Null) AND ((m_ActionPlan.DeleteFlg) Is Null) "
                        + " AND ((m_Matter.DeleteFlg) Is Null));";
            var recordSet = database.Execute(mySql);
            //alert(mySql);
            //console.log(mySql);
            while (!recordSet.EOF) {
                //フォルダ名生成
                var foldername = Number(recordSet(1)) + '-' + Number(recordSet(2)) + '-' + Number(recordSet(3)) + '_' + recordSet(4);
                //フォルダ作成
                var makefoldername = String(fpath + foldername);
                var newfolder = myObject.CreateFolder(makefoldername);
                recordSet.MoveNext();
            }
            recordSet.Close();
            recordSet = null;
        }
        crecordSet.Close();
        crecordSet = null;
        alert("「" + fpath + "」にフォルダを作成しました。" );
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}
//*****************************************************************************
//
// エラーチェック関連
//
//******************************************************************************

function dataCheck(CheckValue, Chckflg, Chkcount) {
    //データをチェックする関数
    var focucCnt = Chkcount;
    var tempStr = "は必ず入力してください。";
    var txtCd = document.getElementById('txtMatterCd' + Chkcount);
    var txtDetail = document.getElementById('txtMatter' + Chkcount);
    if (Chckflg == 0 && CheckValue == "") {
        alert("案件ID" + tempStr);
        txtCd.focus();
        return false;
    }
    if (Chckflg == 1 && CheckValue == "") {
        alert("案件内容" + tempStr);
        txtDetail.focus();
        return false;
    }
    return true;
}

function StringSeparator(objString) {
//行動計画IDを取得する。(文字列セパレート)
    var sobj = objString;
    var separator = "-";
    var allayworkCd = sobj.split(separator);
    var robj = allayworkCd[1];
    return robj;
}