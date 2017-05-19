//-------------------------------------------------------------------
// 行動計画登録用モジュール
//  2013/5/25  Ver1.0    Created By M.Nishimura
//
//  機能：行動計画マスタ(部門方針)登録画面制御等を行う
//-------------------------------------------------------------------
// 追加ボタン押下時に画面要素を追加する。
onload = init;
onunload = dbClose;
var ItemField = {
    //div要素の中で最大のitemNOを取得してcurrentNumberにセットする。
    currentNumber: 0,
    itemTemplate: '行動計画ID　:<input type="text" name="txtActionPlanCd__count__" id="txtActionPlanCd__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="" \/>' + '行動計画内容:<input type="text" name="txtActionPlan__count__" id="txtActionPlan__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="" \/>' + '補足説明　　:<input type="text" name="txtActionPlanMemo__count__" id="txtActionPlanMemo__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="" \/>' + '<input type="button" name="btnInsert__count__" id="btnInsert__count__" value="登録" onclick="dataInsert(txtActionPlanCd__count__.value,txtActionPlan__count__.value,txtActionPlanMemo__count__.value,__count__)" \/>' + '<input type="button" name="btnUpdate__count__" id="btnUpdate__count__" value="更新" onclick="dataUpdate(txtActionPlanCd__count__.value,txtActionPlan__count__.value,txtActionPlanMemo__count__.value,__count__)" \/>' + '<input type="button" name="btnDelete__count__" id="btnDelete__count__" value="削除" onclick="dataDelete(txtActionPlanCd__count__.value,__count__)" \/>',
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
        //テキストボックス追加時に行動計画IDにフォーカス
        var nxtfield = document.getElementById('txtActionPlanCd' + this.currentNumber);
        //最新テキストボックスにテキストボックスに表示されているID+1の値を表示する。
        nxtfield.value = this.currentNumber;
        nxtfield.focus();
    },
    remove: function() {
        var chkCdTxtbox = document.getElementById('txtActionPlanCd' + this.currentNumber);
        var chkDeTxtbox = document.getElementById('txtActionPlan' + this.currentNumber);
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
            //テキストボックス削除時に行動計画IDにフォーカス
            var beforefield = document.getElementById('txtActionPlanCd' + this.currentNumber);
            if (this.currentNumber == 0) {
                return;
            } //最終行除外
            beforefield.focus();
        } else {
            alert("入力データが存在します");
            var currentfield = document.getElementById('txtActionPlanCd' + this.currentNumber);
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
    document.getElementById("AdminReload").onclick = function() {
        AdministrationCdDisplay();
    }
    dbConnect(); //データベース接続
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //登録用日時取得
    OperateDate = dateFormat.format(new Date());
    // データベースからレコード数を取得し必要な数量のテキストボックスを表示して値を表示する
    AdministrationCdDisplay();
    defaultselect();
    dataDisplay();
    ItemField.add();
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

function dataCount() {
    //期の行動計画件数カウント
    var mySql = "SELECT COUNT (ActionPlanID) AS IDCount FROM m_ActionPlan WHERE DeleteFlg Is Null AND AdministrationID = '" + selectAdministration.value + "'";
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
    return idcount;
}

function dataDisplay() {
    try {
        //データを表示する関数
        var mySql = "SELECT * FROM m_ActionPlan WHERE ( DeleteFlg Is Null) AND (AdministrationId = '" + selectAdministration.value + "') ORDER BY ActionPlanID";
        var recordSet = database.Execute(mySql);
        var counter = 1;
        var tempHtml = "";
        while (!recordSet.EOF) {
            tempHtml = '行動計画ID　:<input type="text" name="txtActionPlanCd' + counter + '" id="txtActionPlanCd' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(1) + '" \/>' + '行動計画内容:<input type="text" name="txtActionPlan' + counter + '" id="txtActionPlan' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="' + recordSet(2) + '" \/>' + '補足説明　　:<input type="text" name="txtActionPlanMemo' + counter + '" id="txtActionPlanMemo' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="' + recordSet(3) + '" \/>' + '<input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="登録" onclick="dataInsert(txtActionPlanCd' + counter + '.value,txtActionPlan' + counter + '.value,txtActionPlanMemo' + counter + '.value,' + counter + ')" \/>' + '<input type="button" name="btnUpdate' + counter + '" id="btnUpdate' + counter + '" value="更新" onclick="dataUpdate(txtActionPlanCd' + counter + '.value,txtActionPlan' + counter + '.value,txtActionPlanMemo' + counter + '.value,' + counter + ')" \/>' + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="削除" onclick="dataDelete(txtActionPlanCd' + counter + '.value,' + counter + ')" \/>';
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

function dataInsert(ActionPlanCd, ActionPlan, ActionPlanMemo, txtCount) {
    //  //データを追加する関数
    try {
        var Chkcount = txtCount;
        if (dataCheck(ActionPlanCd, 0, Chkcount) && dataCheck(ActionPlan, 1, Chkcount)) {
            var mySql = "INSERT INTO m_ActionPlan ( ActionPlanID ,ActionPlan ,ActionPlanMemo , Creationdate , AdministrationId ) VALUES(" + "'" + ActionPlanCd + "','" + ActionPlan + "','" + ActionPlanMemo + "','" + OperateDate + "','" + selectAdministration.value + " ');"
            //      alert(mySql);
            database.Execute(mySql);
            alert("追加しました。");
            ItemField.add();
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataUpdate(ActionPlanCd, ActionPlan, ActionPlanMemo, txtCount) {
    //データを更新する関数
    try {
        var Chkcount = txtCount;
        if (dataCheck(ActionPlanCd, 0, Chkcount) && dataCheck(ActionPlan, 1, Chkcount)) {
            var mySql = "UPDATE m_ActionPlan SET ActionPlan ='" + ActionPlan + "', ActionPlanMemo = '" + ActionPlanMemo + "', UpdateDate = '" + OperateDate + "' WHERE ( ActionPlanID = '" + ActionPlanCd + "' ) AND ( AdministrationId = '" + selectAdministration.value + "' );"
            //      console.log(mySql);
            database.Execute(mySql);
            dataDisplay();
            alert("更新しました。");
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataDelete(ActionPlanCd, txtCount) {
    //データを削除する関数
    try {
        var Chkcount = txtCount;
        if (dataCheck(ActionPlanCd, 0, Chkcount)) {
            var mySql = " UPDATE m_ActionPlan SET DeleteFlg = '1', DeleteDate = '" + OperateDate + "' WHERE ActionPlanID = '" + ActionPlanCd + "' AND AdministrationId = '" + selectAdministration.value + "'";
            //      console.log(mySql);
            database.Execute(mySql);
            alert("削除しました。");
            ItemField.clear()
            dataDisplay();
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function AdministrationCdDisplay() {
    //行動計画IDをセレクトボックスに表示し行動計画をラベルに表示する関数
    var mySql = "SELECT m_Administration.AdministrationID, m_Administration.AdministrationDetail, m_Administration.Businessyear, m_Administration.DeleteFlg, m_Businessyear.ShowFlg " + "FROM m_Administration INNER JOIN m_Businessyear ON m_Administration.Businessyear = m_Businessyear.BusinessYear " + "WHERE (((m_Administration.DeleteFlg) Is Null) AND ((m_Businessyear.ShowFlg) ='0' )) ORDER BY m_Administration.AdministrationID ;";
    var recordSet = database.Execute(mySql);
    document.getElementById("AdministrationCdDisplay").innerHTML = "";
    var tempHtml = "基本方針：　<select name=\"selectAdministration\" id=\"selectAdministration\">\n";
    tempHtml = tempHtml + "\t<option value=\"0\">選択してください。</option>\n";
    while (!recordSet.EOF) {
        tempHtml = tempHtml + "\t<option value=\"" + recordSet(0) + "\">" + recordSet(0) + "：" + recordSet(1) + "</option>\n";
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + "</select>";
    //	console.log(tempHtml);
    document.getElementById("AdministrationCdDisplay").innerHTML = tempHtml;
    selectAdministration = document.getElementById("selectAdministration");
    selectAdministration.onchange = function() {
        AdministrationCdchange(this);
    }
    recordSet.Close();
    recordSet = null;
}

function AdministrationCdchange(obj) {
    //セレクトボックス更新時の画面制御
    if (obj.selectedIndex == 0) {
        var seladmin = document.getElementById("selectAdministration");
        alert("基本方針を選択してください。");
        seladmin.focus();
        return;
    }
    var counter = dataCount();
    if (counter == 0) {
        //0件の場合は画面をクリアする。
        var clfield = document.getElementById('item1');
        clfield.removeChild(clfield.lastChild);
        clfield.innerHTML = '';
        dataDisplay();
        ItemField.add();
    } else {
        dataDisplay();
    }
}

function defaultselect() {
    //セレクトボックスにデフォルト値をセットする。
    var selcounter = document.getElementsByTagName("option").length - 1
    var selyearop = document.getElementById("selectAdministration");
    selyearop.options[selcounter].selected = true;
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
    var txtCd = document.getElementById('txtActionPlanCd' + Chkcount);
    var txtDetail = document.getElementById('txtActionPlan' + Chkcount);
    if (Chckflg == 0 && CheckValue == "") {
        alert("行動計画ID" + tempStr);
        txtCd.focus();
        return false;
    }
    if (Chckflg == 1 && CheckValue == "") {
        alert("行動計画内容" + tempStr);
        txtDetail.focus();
        return false;
    }
    return true;
}