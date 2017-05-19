//-------------------------------------------------------------------
// 定型作業登録用モジュール
//  2013/12/XX  Ver1.0    Created By M.Nishimura
//  2017/5/19   Ver1.1    リファクタリング(社員コード部分の外部化)
//
//  機能：定型作業登録画面の作業計画を行う
//-------------------------------------------------------------------

//日報登録画面からパラメータ取得
var query = location.search.substring(1);
if (1 < window.location.search.length) {
    // クエリの区切り記号 (&) で文字列を配列に分割する
    var parameters = query.split('&');
    var result = new Object();
    for (var i = 0; i < 2; i++) {
        // パラメータ名とパラメータ値に分割する
        var element = parameters[i].split('=');
        result[i] = decodeURIComponent(element[1]);
        var Emp = result[0];
        var Cnt = result[1];
    }

}
var EmpCd = Emp;     //担当者コード
var TxtCnt = Cnt;     //テキスト行数

//初期化
onload = init;
onunload = dbClose;

//*
//* 追加ボタン押下時に入力項目を追加する。
//*

var ItemField = {
    //div要素の中で最大のitemNOを取得してcurrentNumberにセットする。
    currentNumber: 0,
    itemTemplate: '<table style ="width:1048px" border="1" >'
                 + '<tr><td><input type="button" name="btnSelect__count__" id="btnSelect__count__" value="選択" onclick = "selectRoutine(0,__count__)" \/>'
                 + '定型作業ID　:<input type="text" name="txtPlanCd__count__" id="txtPlanCd__count__"  style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="" \/>'
                 + '案件:<span id="MatterCdDisplay__count__"></span>' + '<span id="MatterDisplay__count__"></span>' + '作業:<span id="TaskCdDisplay__count__"></span>'
                 + '<span id="TaskDisplay__count__"></span>'
                 + '<br/>定型作業内容:<textarea name="txtMemo__count__" id="txtMemo__count__" cols="100" rows="2"  onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">定型作業内容を入力してください。<\/textarea><\/td>'
                 + '<td><input type="button" name="btnInsert__count__" id="btnInsert__count__" value="登録" onclick="btnActionSelect(txtPlanCd__count__.value,txtMemo__count__.value,__count__,0)" \/>'
                 + '<input type="button" name="btnDelete__count__" id="btnDelete__count__" value="削除" onclick="btnActionSelect(txtPlanCd__count__.value,txtMemo__count__.value,__count__,1)" \/>',
    add: function () {
        //テキストボックスの最後の要素番号取得
        var eleNumber = document.getElementsByTagName("div").length - 1;
        this.currentNumber = eleNumber;
        var beforeNumber = eleNumber;
        //テキストフィールド追加
        this.currentNumber++;
        var field = document.getElementById('item' + this.currentNumber);
        var newItem = this.itemTemplate.replace(/__count__/mg, this.currentNumber);
        field.innerHTML = newItem;
        var nextNumber = this.currentNumber + 1;
        var new_area = document.createElement("div");
        new_area.setAttribute("id", "item" + nextNumber);
        MatterCdDisplay(this.currentNumber, 0);
        TaskCdDisplay(this.currentNumber, "0");
        field.appendChild(new_area);
        //テキストボックス追加時に作業計画IDにフォーカス
        var nxtfield = document.getElementById('txtPlanCd' + this.currentNumber);
        //2番目以降の項目では前行の作業計画ID値を取得する。
        if (beforeNumber != 0) {
            var beforefield = document.getElementById('txtPlanCd' + beforeNumber);
            var befvalue = beforefield.value;
        }
        //最新テキストボックスにテキストボックスに表示されているID+1の値を表示する。
        //データベースに登録されている値と最新番号がずれている場合は、日報IDに+1する。
        if (beforeNumber != 0 && befvalue != beforeNumber) {
            var nextNumber = Number(befvalue) + 1;
            nxtfield.value = nextNumber;
        } else {
            nxtfield.value = this.currentNumber;
        }
        //案件セレクトボックスにフォーカス移動
        var nxtMatter = document.getElementById('selectMatter' + this.currentNumber);
        nxtMatter.focus();
    },
    //項目削除
    remove: function () {
        var chkPCdTxtbox = document.getElementById('txtPlanCd' + this.currentNumber);
        var chkMCdTxtbox = document.getElementById('txtMemo' + this.currentNumber);
        if (this.currentNumber == 0) {
            return;
        }
        //入力データ存在時はテキストボックス削除不可
        if (chkPCdTxtbox.value == "" && chkMCdTxtbox.value == '') {
            //テキストフィールド削除
            var field = document.getElementById('item' + this.currentNumber);
            field.removeChild(field.lastChild);
            field.innerHTML = '';
            this.currentNumber--;
            //テキストボックス削除時に案件IDにフォーカス
            var beforefield = document.getElementById('txtPlanCd' + this.currentNumber);
            if (this.currentNumber == 0) {
                return;
            } //最終行除外
            beforefield.focus();
        } else {
            alert("入力データが存在します");
            var currentfield = document.getElementById('txtPlanCd' + this.currentNumber);
            currentfield.focus();
        }
    },
    clear: function () {
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

//*
//* 初期設定をする関数
//*
function init() {
    //データベース接続
    dbConnect();
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //登録用日時取得
    OperateDate = dateFormat.format(new Date());
    //検索ボタン
    document.getElementById("btnEmpSearch").onclick = function () {
        EmpIdUpdate();
    }
    // 担当者をセットして画面の初期表示
    EmpCdisplay(EmpCd);
    dataDisplay(EmpCd, TxtCnt);

}

//*
//* 終了処理
//*
function OperateEnd() {
    dbClose();
    (window.open('', '_self').opener = window).close();
}

//*****************************************************************************
//
// データ操作関連
//
//******************************************************************************

//*
//*　データベースへの追加・削除・更新判断
//*
function btnActionSelect(RoutineWorkID, Memo, txtCount, selectMode) {
    var sCount = txtCount;        //項目位置取得用
    //担当を選択していない場合のチェック
    var selEmp = document.getElementById('selectEmpId');
    if (selEmp.selectedIndex == 0) {
        alert("担当者を選択してください。");
        selEmp.focus();
        return;
    }
    //案件と作業を選択していない場合のチェック
    var selMatter = document.getElementById('selectMatter' + sCount);
    if (selMatter.value == 0) {
        alert("案件を選択してください。");
        selMatter.focus();
        return;
    }
    var selTask = document.getElementById('selectTask' + sCount);
    if (selTask.value == 0) {
        alert("作業を選択してください。");
        selTask.focus();
        return;
    }
    //必要項目類セット
    var wid = RoutineWorkID;
    var RoutineMemo = Memo;
    dataCheck(RoutineWorkID, 0, sCount);
    var EmpID = EmpCd;
    var AdminID = document.getElementById('AdministrationCd' + sCount).innerText;
    var ActionID = document.getElementById('ActionPlanCd' + sCount).innerText;
    var MatterID = document.getElementById('MatterCd' + sCount).innerText;
    var TaskID = document.getElementById('TaskCd' + sCount).innerText;
    //DB登録状況確認
    var mySql = " SELECT Count(RoutineWorkID) AS CountWid "
                + " FROM m_RoutineWork "
                + " WHERE ( RoutineWorkID =" + wid + ") AND ( Empid ='" + EmpID + "');";

    //console.log(mySql);
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
    //登録モードによる処理判別
    if (selectMode == 1) {
        //削除
        dataDelete(wid, EmpID, sCount);
        return;
    }
    if (selectMode == 0 && idcount == 0) {
        //追加
        dataInsert(wid, RoutineMemo, AdminID, ActionID, MatterID, TaskID, EmpID, sCount);
    } else {
        //更新
        dataUpdate(wid, RoutineMemo, AdminID, ActionID, MatterID, TaskID, EmpID, sCount);
    }

}

//*
//* 従業員コードを更新した際に画面を再描画する関数
//*
function EmpIdUpdate() {
    var EmpID = EmpCd;
    var mySql = " SELECT Count(RoutineWorkID) AS CountWid "
                + " FROM m_RoutineWork "
                + " WHERE ( Empid ='" + EmpID + "') AND (DeleteFlg ='0');";
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
    //    console.log(mySql);
    if (idcount == 0) {
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
        dataDisplay(EmpID, 0);
    }
    recordSet.Close();
    recordSet = null;
}

//*
//* データを表示する関数
//*
function dataDisplay(EmpId, tCnt) {
    try {
        varTxtCnt = tCnt
        var mySql = " SELECT RoutineWorkID, AdministrationID, ActionplanID, MatterID, TaskID ,RoutineMemo " + " FROM m_RoutineWork"
                     + " WHERE (Empid='" + EmpId + "') AND (DeleteFlg = '0' ) ORDER BY  RoutineWorkID ;";
        var recordSet = database.Execute(mySql);
        //console.log(mySql);
        var counter = 1;
        var tempHtml = "";
        while (!recordSet.EOF) {
            tempHtml = '<table style ="width:1048px" border="1" >'
                         + '<tr><td><input type="button" name="btnSelect' + counter + '" id="btnSelect' + counter + '" value="選択" onclick="selectRoutine(' + TxtCnt + ',' + counter + ')" \/>'
                         + '定型作業ID　:<input type="text" name="txtPlanCd' + counter + '" id="txtPlanCd' + counter + '" style ="width:30px"  onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(0) + '" \/>'
                         + '案件:<span id="MatterCdDisplay' + counter + '"></span>' + '<span id="MatterDisplay' + counter + '"></span>'
                         + '作業:<span id="TaskCdDisplay' + counter + '" ></span>' + '<span id="TaskDisplay' + counter + '"></span>'
                         + '<br/>定型作業内容:<textarea name="txtMemo' + counter + '" id="txtMemo' + counter + '" cols="100" rows="2"  onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">' + recordSet(5) + ' <\/textarea><\/td>'
                         + '<td><input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="登録" onclick="btnActionSelect(txtPlanCd' + counter + '.value,txtMemo' + counter + '.value,' + counter + ',0)" \/>'
                         + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="削除" onclick="btnActionSelect(txtPlanCd' + counter + '.value,txtMemo' + counter + '.value,' + counter + ',1)" \/><\/td><\/tr></table>';
            var field = document.getElementById('item' + counter);
            var newItem = tempHtml;
            field.innerHTML = newItem;
            var nextNumber = counter + 1;
            var new_area = document.createElement("div");
            new_area.setAttribute("id", "item" + nextNumber);
            field.appendChild(new_area);
            //案件ID表示
            var Mcd = Number(recordSet(1)) + '-' + Number(recordSet(2)) + '-' + Number(recordSet(3));
            MatterCdDisplay(counter, Mcd);
            var mdSelect = document.getElementById('MatterCdDisplay' + counter)
            mdSelect.innerHTML = "";
            var tempHtml = '<span id="AdministrationCd' + counter + '"\">' + recordSet(1) + '<\/span>' + '-' + '<span id=\"ActionPlanCd' + counter + '\">' + recordSet(2) + '<\/span>' + '-' + '<span id="MatterCd' + counter + '"\">' + recordSet(3) + '<\/span>';
            mdSelect.innerHTML = tempHtml;
            //作業ID表示表示用
            var Tcd = recordSet(4);
            TaskCdDisplay(counter, Tcd);
            var mtSelect = document.getElementById('TaskCdDisplay' + counter);
            mtSelect.innerHTML = "";
            var tempHtml = '<span id="TaskCd' + counter + '"\">' + Tcd + '<\/span>';
            mtSelect.innerHTML = tempHtml;
            recordSet.MoveNext();
            counter++;
        }
        recordSet.Close();
        recordSet = null;
        ItemField.add();

    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//* データを追加する関数
//*
function dataInsert(RoutineWorkID, PMemo, AdminID, ActionID, MatterID, TaskID, EmpID, PlanDate, Chkcount) {
    try {
        if (dataCheck(RoutineWorkID, 0, Chkcount) && dataCheck(PMemo, 1, Chkcount)) {
            var nextNum = Chkcount + 2;
            var nextItem = document.getElementById('item' + nextNum);
            var mySql = "INSERT INTO m_RoutineWork (EmpID,AdministrationID,ActionplanID,MatterID,TaskID,RoutineMemo,Creationdate,DeleteFlg ) "
                      + " VALUES ('" + EmpID + "','" + AdminID + "','" + ActionID + "','" + MatterID + "','" + TaskID + "','" + PMemo + "','" + OperateDate + "','0');";
            database.Execute(mySql);
            alert("追加しました。");
            //最終行のテキストボックスなら行追加
            if (nextItem) {
                return;
            } else {
                dataDisplay(EmpID);
            }
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//* データを更新する関数
//*
function dataUpdate(RoutineWorkID, PMemo, AdminID, ActionID, MatterID, TaskID, EmpID, Chkcount) {
    try {
        if (dataCheck(RoutineWorkID, 0, Chkcount) && dataCheck(PMemo, 1, Chkcount)) {
            var mySql = " UPDATE m_RoutineWork SET AdministrationID ='" + AdminID + "', ActionplanID = '" + ActionID + "', MatterID = '" + MatterID + "', TaskID = '" + TaskID + "', RoutineMemo = '" + PMemo + "',"
			            + " DeleteFlg ='0' WHERE ( RoutineWorkID = " + RoutineWorkID + " ) AND ( Empid = '" + EmpID + "' );";
            //console.log(mySql);
            database.Execute(mySql);
            alert("更新しました。");
            dataDisplay(EmpID);
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//* データを削除する関数
//*
function dataDelete(RoutineWorkID, EmpID, Chkcount) {
    try {
        if (dataCheck(RoutineWorkID, 0, Chkcount)) {
            var mySql = " UPDATE m_RoutineWork SET DeleteFlg ='1', DeleteDate = '" + OperateDate + "'"
			            + " WHERE ( RoutineWorkID = " + RoutineWorkID + " ) AND ( Empid = '" + EmpID + "' );";
            //      console.log(mySql);
            database.Execute(mySql);
            alert("削除しました。");
            ItemField.clear();
            dataDisplay(EmpID);
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//* 案件をセレクトボックスに表示する関数
//*
function MatterCdDisplay(Mcounter, MatterCd) {
    var labCounter = Mcounter;
    var mySql = " SELECT m_Administration.AdministrationID, m_ActionPlan.ActionplanID, m_Matter.MatterID, m_Matter.MatterName "
        + " FROM (m_ActionPlan INNER JOIN m_Matter ON m_ActionPlan.ActionplanID = m_Matter.ActionplanID) "
        + " INNER JOIN (m_Administration INNER JOIN m_Businessyear ON m_Administration.Businessyear = m_Businessyear.BusinessYear) "
        + " ON (m_ActionPlan.AdministrationID = m_Administration.AdministrationID) "
        + " AND (m_Matter.AdministrationID = m_Administration.AdministrationID) "
        + " WHERE (m_ActionPlan.DeleteFlg Is Null) AND (m_Businessyear.ShowFlg = '0'); ";
    //alert(mySql);
    var recordSet = database.Execute(mySql);
    var MatterBox = document.getElementById('MatterDisplay' + labCounter);
    MatterBox.innerHTML = "";
    var tempHtml = '<select name="selectMatter' + labCounter + '" id="selectMatter' + labCounter + '" onchange="MatterCdchange(this,' + labCounter + ')" \">\n';
    tempHtml = tempHtml + '\t<option value="0">選択してください。<\/option>\n';
    while (!recordSet.EOF) {
        var optionval = Number(recordSet(0)) + '-' + Number(recordSet(1)) + '-' + Number(recordSet(2));
        //オプション値指定がある場合はそのオプションを選択状態にする。
        if (optionval == MatterCd) {
            tempHtml = tempHtml + '\t<option value="' + optionval + '" selected >' + recordSet(3) + '<\/option>\n';
        } else {
            tempHtml = tempHtml + '\t<option value="' + optionval + '"\">' + recordSet(3) + '<\/option>\n';
        }
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + '</select>';
    MatterBox.innerHTML = tempHtml;
    recordSet.Close();
    recordSet = null;
}

//*
//* 案件セレクトボックス更新時の画面制御
//*
function MatterCdchange(obj, Mcounter) {
    //基本方針CDと行動計画CDと案件CDを分割する。。
    var laMcounter = Mcounter;
    var workCd = obj.value;
    var separator = "-";
    var allayworkCd = workCd.split(separator);
    if (obj.selectedIndex == 0) {
        var selmatter = document.getElementById("selectMatter");
        alert("案件を選択してください。");
        obj.focus();
        return;
    }
    var AdministrationCd = allayworkCd[0];
    var ActionPlanCd = allayworkCd[1];
    var MatterCd = allayworkCd[2];
    var mySql = " SELECT m_Matter.AdministrationID, m_Matter.ActionplanID, m_Matter.MatterID"
        + " FROM m_ActionPlan INNER JOIN (m_Matter INNER JOIN (m_Administration INNER JOIN m_Businessyear"
        + " ON m_Administration.Businessyear = m_Businessyear.BusinessYear)"
        + " ON m_Matter.AdministrationID = m_Administration.AdministrationID)"
        + " ON (m_ActionPlan.ActionplanID = m_Matter.ActionplanID)"
        + " AND (m_ActionPlan.AdministrationID = m_Administration.AdministrationID)"
        + " WHERE (m_Matter.AdministrationID ='" + AdministrationCd + "')"
        + " AND ( m_Matter.ActionplanID ='" + ActionPlanCd + "')"
        + " AND (m_Matter.MatterID ='" + MatterCd + "')"
        + " AND (m_ActionPlan.DeleteFlg Is Null)"
        + " AND (m_Businessyear.ShowFlg = '0');"
    var recordSet = database.Execute(mySql);
    var sk1 = recordSet(0); //基本方針ID
    var sk2 = recordSet(1); //行動計画ID
    var sk3 = recordSet(2); //案件ID
    var mdSelect = document.getElementById('MatterCdDisplay' + Mcounter)
    mdSelect.innerHTML = "";
    var tempHtml = '<span id="AdministrationCd' + laMcounter + '"\">' + recordSet(0) + '<\/span>' + '-' + '<span id=\"ActionPlanCd' + laMcounter + '\">' + recordSet(1) + '<\/span>' + '-' + '<span id="MatterCd' + laMcounter + '"\">' + recordSet(2) + '<\/span>';
    mdSelect.innerHTML = tempHtml;
}

//*
//* 作業をセレクトボックスに表示する関数
//*
function TaskCdDisplay(Mcounter, TaskCd) {
    var labCounter = Mcounter;
    var mySql = " SELECT m_Task.* FROM m_Task  ORDER BY TaskID;";
    //console.log(mySql);
    var recordSet = database.Execute(mySql);
    var TaskBox = document.getElementById('TaskDisplay' + labCounter);
    TaskBox.innerHTML = "";
    var tempHtml = '<select name="selectTask' + labCounter + '" id="selectTask' + labCounter + '" onchange="TaskCdchange(this,' + labCounter + ')" \">\n';
    tempHtml = tempHtml + '\t<option value="0">選択してください。<\/option>\n';
    while (!recordSet.EOF) {
        //オプション値指定がある場合はそのオプションを選択状態にする。
        if (recordSet(0) == Number(TaskCd)) {
            tempHtml = tempHtml + '\t<option value=" ' + TaskCd + '" selected >' + recordSet(1) + '<\/option>\n';
        } else {
            tempHtml = tempHtml + '\t<option value=" ' + recordSet(0) + '" >' + recordSet(1) + '<\/option>\n';
        }
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + '</select>';
    TaskBox.innerHTML = tempHtml;
    recordSet.Close();
    recordSet = null;
}

//*
//* 作業セレクトボックス更新時の画面制御
//*
function TaskCdchange(obj, Mcounter) {
    var laMcounter = Mcounter;
    var workCd = obj.value;
    if (obj.selectedIndex == 0) {
        var seltask = document.getElementById("selectTask");
        alert("作業を選択してください。");
        obj.focus();
        return;
    }
    var mtSelect = document.getElementById('TaskCdDisplay' + laMcounter)
    mtSelect.innerHTML = "";
    var tempHtml = '<span id="TaskCd' + laMcounter + '"\">' + workCd + '<\/span>';
    mtSelect.innerHTML = tempHtml;
}



//*****************************************************************************
//
// エラーチェック関連
//
//******************************************************************************
//*
//* データをチェックする関数
//*
function dataCheck(CheckValue, Chckflg, Chkcount) {
    var focucCnt = Chkcount;
    var tempStr = "は必ず入力してください。";
    var txtCd = document.getElementById('txtPlanCd' + Chkcount);
    var txtDetail = document.getElementById('txtMemo' + Chkcount);
    var sel1Cd = document.getElementById('selMatterCd' + Chkcount);
    var sel2Cd = document.getElementById('selTaskCd' + Chkcount);
    if (Chckflg == 0 && CheckValue == "") {
        alert("定型作業ID" + tempStr);
        txtCd.focus();
        return false;
    }
    if (Chckflg == 1 && CheckValue == "") {
        alert("定型作業" + tempStr);
        txtDetail.focus();
        return false;
    }
    return true;
}

//*
//* 基本方針、行動計画、案件の文字列分割用
//*
function StringSeparator(objString) {
    var sobj = objString;
    var separator = "-";
    var allayworkCd = sobj.split(separator);
    var robj = allayworkCd[1];
    return robj;
}


//*****************************************************************************
//
// 定型作業を日報画面にコピーする
//
//******************************************************************************

//*
//* 選択ボタン押下で日報画面に定型作業内容をコピー
//*　参照URL:http://www.tagindex.com/javascript/window/sub_to_main.html
//*          http://webapp.winofsql.jp/webclass101128172259.htm
//*          http://www.nandani.sakura.ne.jp/web_all/javascript/32/
//*
function selectRoutine(Pcounter,Row) {
    if (Pcounter == 0) {
        alert("定型作業登録されていないので選択できません。");
    } else {
    if (!window.opener || window.opener.closed) {
        window.alert('メインウィンドウがありません'); 
    }else{
        //var Value = "内容" + TxtMemo + "、案件:" + SelectB1 + "、作業ID:" + TaskID;
        var TxtMemo = document.getElementById('txtMemo' + Row).innerHTML;
        var AdminID = document.getElementById('AdministrationCd' + Row).innerText;         //基本方針
        var ActionID = document.getElementById('ActionPlanCd' + Row).innerText;            //行動計画
        var MatterID = document.getElementById('MatterCd' + Row).innerText;                  //案件ID
        var SelectB1 = Number(AdminID) + '-' + Number(ActionID) + '-' + Number(MatterID)                //案件セレクトボックス用のID
        var TaskID = Number(document.getElementById('TaskCd' + Row).innerText);                      //作業ID
        //実績・補足欄へのコピー
        var ParentTxt = window.opener.document.getElementById('txtReportMemo' + Pcounter);
        ParentTxt.value = TxtMemo;
        //案件のコピー
        var MatterDisp = window.opener.document.getElementById('MatterCdDisplay' + Pcounter);
        var tempHtml = '<span id="AdministrationCd' + Pcounter + '"\">' + Number(AdminID) + '<\/span>' + '-' + '<span id=\"ActionPlanCd' + Pcounter + '\">' + Number(ActionID) + '<\/span>' + '-' + '<span id="MatterCd' + Pcounter + '"\">' + Number(MatterID) + '<\/span>';
        MatterDisp.innerHTML = tempHtml;
        var ParentMatter = window.opener.document.getElementById('selectMatter' + Pcounter).getElementsByTagName('option');
        for (i = 0; i < ParentMatter.length; i++) {
            if (ParentMatter[i].value == SelectB1) {
                ParentMatter[i].selected = true;
                break;
            }
        }
        //作業のコピー
        var TaskDisp = window.opener.document.getElementById('TaskCdDisplay' + Pcounter);
        var tempHtmlT = '<span id="TaskCd' + Pcounter + '"\">' + TaskID + '<\/span>';
        TaskDisp.innerHTML = tempHtmlT;
        var ParentTask = window.opener.document.getElementById('selectTask' + Pcounter).getElementsByTagName('option');
        for (i = 0; i < ParentTask.length; i++) {
            if (ParentTask[i].value == TaskID) {
                ParentTask[i].selected = true;
                break;
            }
        }
        window.close();
    }
   }
}