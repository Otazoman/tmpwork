//-------------------------------------------------------------------
// 作業計画登録用モジュール
//  2013/6/4  Ver1.0    Created By M.Nishimura
//  2013/7/3　Ver1.1　　作業計画ID表示部分改善
//  2013/7/10 Ver1.2    前日作業計画コピー機能追加
//  2017/2/27 Ver1.3    上部メニュー固定化に伴う要素数取得の不具合修正
//                      前日分作業コピー機能の削除フラグ考慮漏れの修正
//  2017/5/19 Ver1.4    リファクタリング(社員コード部分の外部化)
//
//  機能：作業計画(日次の作業予定(翌日予定))登録画面制御等を行う
//-------------------------------------------------------------------

var EmpCd=location.search.substring(1);     //ログイン画面から担当者CD取得

onload = init;
onunload = dbClose;

//*
//* 追加ボタン押下時に入力項目を追加する。
//*
var ItemField = {
    //div要素の中で最大のitemNOを取得してcurrentNumberにセットする。
    currentNumber: 0,
    itemTemplate: '<table style ="width:1180px" ><tr><td>作業計画ID　:<input type="text" name="txtPlanCd__count__" id="txtPlanCd__count__"  style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="" \/>'
                 + '案件:<span id="MatterCdDisplay__count__"></span>' + '<span id="MatterDisplay__count__"></span>' + '作業:<span id="TaskCdDisplay__count__"></span>'
                 + '<span id="TaskDisplay__count__"></span>'
                 + '作業予定:<textarea name="txtMemo__count__" id="txtMemo__count__" cols="24" rows="3"  onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">作業予定を入力してください。<\/textarea><\/td>'
                 + '<td><input type="button" name="btnInsert__count__" id="btnInsert__count__" value="登録" onclick="btnActionSelect(txtPlanCd__count__.value,txtMemo__count__.value,__count__,0)" \/>'
                 + '<input type="button" name="btnDelete__count__" id="btnDelete__count__" value="削除" onclick="btnActionSelect(txtPlanCd__count__.value,txtMemo__count__.value,__count__,1)" \/>',
    add: function () {
        //テキストボックスの最後の要素番号取得
        //カレンダーのロジックでdiv要素が2つ使用されていて意図しないdivを拾ってくるのでその対応
        var eleNumber = document.getElementsByClassName("table").length - 1;
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
        new_area.setAttribute("class", "table");
        MatterCdDisplay(this.currentNumber,0);
        TaskCdDisplay(this.currentNumber,"0");
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
        //カレンダーのロジックでdiv要素が2つ使用されていて意図しないdivを拾ってくるのでその対応
        var clNumber = document.getElementsByClassName("table").length - 1;
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
    //計画日表示
    txtPlanDate = document.getElementById("txtPlanDate");
    var txtdate = new DateFormat("yyyy/MM/dd");
    txtdate = txtdate.format(new Date());
    var NextDay = DayCalculate(txtdate);
    txtdate = NextDay;
    txtPlanDate.value = txtdate;
    //計画日のテキストボックス制御
    txtPlanDate.onblur = function () {
        this.style.backgroundColor = "#ffffff";
    }
    document.getElementById("btnDaySearch").onclick = function() {
        txtDateUpdate(txtPlanDate);
    }
    //前日分日報コピーボタン
    document.getElementById("btnBeforeDataCopy").onclick = function () {
        beforeDairyPlanCopy();
    }
    dbConnect(); //データベース接続
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //登録用日時取得
    OperateDate = dateFormat.format(new Date());
    // 担当者をセットして画面の初期表示
    EmpCdisplay(EmpCd);
    dataDisplay(txtdate);
}

//*
//* 終了処理
//*
function OperateEnd() {
    dbClose();
    (window.open('', '_self').opener = window).close();
}

//*
//* 計画日更新時の処理
//*
function txtDateUpdate(obj) {
    planDateUpdate();
    obj.style.backgroundColor = "#ffffff";
}

//*****************************************************************************
//
// データ操作関連
//
//******************************************************************************

//*
//*　データベースへの追加・削除・更新判断
//*
function btnActionSelect(WorkplanID, Memo, txtCount,selectMode) {
    var sCount=txtCount;        //項目位置取得用
    //作業計画日を選択していない場合のチェック
    var PlanDate = document.getElementById('txtPlanDate').value;
    if (PlanDate) {
    } else {
        alert("予定日は必須です。");
        txtPlanDate = document.getElementById("txtPlanDate");
        txtPlanDate.focus();
        return;
    }
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
    var wid = WorkplanID;
    var plMemo = Memo;
    var PlanDate = document.getElementById('txtPlanDate').value;
    dataCheck(WorkplanID, 0, sCount);
    var EmpID = EmpCd;
    var AdminID = document.getElementById('AdministrationCd' + sCount).innerText;
    var ActionID = document.getElementById('ActionPlanCd' + sCount).innerText;
    var MatterID = document.getElementById('MatterCd' + sCount).innerText;
    var TaskID = document.getElementById('TaskCd' + sCount).innerText;
    //DB登録状況確認
    var mySql = " SELECT Count(WorkplanID) AS CountWid "
                +" FROM t_workplan "
                + " WHERE ( WorkplanID ='" + wid + "') AND ( Empid ='" + EmpID + "') AND (PlanDate ='" + PlanDate + "');";
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
//    console.log(mySql);
    if (selectMode == 1) {
        //削除
        dataDelete(wid, EmpID, PlanDate, sCount);
        return;
    }
    if (selectMode == 0 && idcount == 0) {
        //追加
        dataInsert(wid, plMemo, AdminID, ActionID, MatterID, TaskID, EmpID, PlanDate, sCount);
    } else {
        //更新
        dataUpdate(wid, plMemo, AdminID, ActionID, MatterID, TaskID, EmpID, PlanDate, sCount);
    }
}

//*
//* 作業計画日を更新した際に画面を再描画する関数
//*
function planDateUpdate() {
    //作業計画日チェック
    var PlanDate = document.getElementById('txtPlanDate').value;
    if (ChckDate(PlanDate)) {
    } else {
        return;
    }
    var EmpID = EmpCd;
    var mySql = " SELECT Count(WorkplanID) AS CountWid "
                + " FROM t_workplan "
                + " WHERE ( Empid ='" + EmpID + "') AND (PlanDate ='" + PlanDate + "') AND (DeleteFlg ='0');";
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
        dataDisplay(PlanDate);
    }
    recordSet.Close();
    recordSet = null;
}

//*
//* データを表示する関数
//*
function dataDisplay(PlanDay) {
    try {
        var PlanDate = PlanDay;
        ChckDate(PlanDate);
        var EmpId = EmpCd;
        var mySql = " SELECT WorkplanID, AdministrationID, ActionplanID, MatterID, TaskID ,Planmemo " + " FROM t_workplan"
                     + " WHERE (PlanDate='" + PlanDate + "') AND (Empid='" + EmpId + "') AND (DeleteFlg = '0' ) ORDER BY  WorkplanID ;";
        var recordSet = database.Execute(mySql);
        //console.log(mySql);
        var counter = 1;
        var tempHtml = "";
        while (!recordSet.EOF) {
            tempHtml = '<table style ="width:1180px" ><tr><td>作業計画ID　:<input type="text" name="txtPlanCd' + counter + '" id="txtPlanCd' + counter + '" style ="width:30px"  onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(0) + '" \/>'
                         + '案件:<span id="MatterCdDisplay' + counter + '"></span>' + '<span id="MatterDisplay' + counter + '"></span>'
                         + '作業:<span id="TaskCdDisplay' + counter + '" ></span>' + '<span id="TaskDisplay' + counter + '"></span>'
                         + '作業予定:<textarea name="txtMemo' + counter + '" id="txtMemo' + counter + '" cols="24" rows="3"  onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">' + recordSet(5) + ' <\/textarea><\/td>'
                         + '<td><input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="登録" onclick="btnActionSelect(txtPlanCd' + counter + '.value,txtMemo' + counter + '.value,' + counter + ',0)" \/>'
                         + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="削除" onclick="btnActionSelect(txtPlanCd' + counter + '.value,txtMemo' + counter + '.value,' + counter + ',1)" \/><\/td><\/tr></table>';
            var field = document.getElementById('item' + counter);
            var newItem = tempHtml;
            field.innerHTML = newItem;
            var nextNumber = counter + 1;
            var new_area = document.createElement("div");
            new_area.setAttribute("id", "item" + nextNumber);
            new_area.setAttribute("class", "table");
            field.appendChild(new_area);
            //案件ID表示
            var Mcd = Number(recordSet(1)) + '-' + Number(recordSet(2)) + '-' + Number(recordSet(3));
            MatterCdDisplay(counter,Mcd);
            var mdSelect = document.getElementById('MatterCdDisplay' + counter)
            mdSelect.innerHTML = "";
            var tempHtml = '<span id="AdministrationCd' + counter + '"\">' + recordSet(1) + '<\/span>' + '-' + '<span id=\"ActionPlanCd' + counter + '\">' + recordSet(2) + '<\/span>' + '-' + '<span id="MatterCd' + counter + '"\">' + recordSet(3) + '<\/span>';
            mdSelect.innerHTML = tempHtml;
            //作業ID表示表示用
            var Tcd = recordSet(4);
            TaskCdDisplay(counter,Tcd);
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
function dataInsert(WorkplanID, PMemo, AdminID, ActionID, MatterID, TaskID, EmpID, PlanDate, Chkcount) {
    try {
        if (dataCheck(WorkplanID, 0, Chkcount) && dataCheck(PMemo, 1, Chkcount)) {
            var nextNum = Chkcount + 2;
            var nextItem = document.getElementById('item' + nextNum);
            var mySql = " INSERT INTO t_workplan ( WorkplanID, AdministrationID, ActionplanID, MatterID, TaskID, Planmemo, Empid, PlanDate, Creationdate, DeleteFlg ) "
                         + " VALUES ('" + WorkplanID + "','" + AdminID + "','" + ActionID + "','" + MatterID + "','" + TaskID + "','" + PMemo + "','" + EmpID + "','" + PlanDate + "','" + OperateDate + "','0');";
            database.Execute(mySql);
            alert("追加しました。");
            //最終行のテキストボックスなら行追加
            if (nextItem) {
                return;
            }else{
                dataDisplay(PlanDate);
            }
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//* データを更新する関数
//*
function dataUpdate(WorkplanID, PMemo, AdminID, ActionID, MatterID, TaskID, EmpID, PlanDate, Chkcount) {
    try {
        if (dataCheck(WorkplanID, 0, Chkcount) && dataCheck(PMemo, 1, Chkcount)) {
            var mySql = " UPDATE t_workplan SET AdministrationID ='" + AdminID + "', ActionplanID = '" + ActionID + "', MatterID = '" + MatterID + "', TaskID = '" + TaskID + "', Planmemo = '" + PMemo + " ', UpdateDate = '" + OperateDate + "',"
			            +" DeleteFlg ='"+ '0' + "'  WHERE ( WorkplanID = '" + WorkplanID + "' ) AND ( Empid = '" + EmpID + "' )  AND ( PlanDate = '" + PlanDate + "' );";
//            console.log(mySql);
            database.Execute(mySql);
            alert("更新しました。");
            dataDisplay(PlanDate);
       }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//* データを削除する関数
//*
function dataDelete(WorkplanID, EmpID, PlanDate, Chkcount) {
    try {
        if (dataCheck(WorkplanID, 0, Chkcount)) {
            var mySql = " UPDATE t_workplan SET DeleteFlg ='1', DeleteDate = '" + OperateDate + "'"
			            + " WHERE ( WorkplanID = '" + WorkplanID + "' ) AND ( Empid = '" + EmpID + "' )  AND ( PlanDate = '" + PlanDate + "' );";
            //      console.log(mySql);
            database.Execute(mySql);
            alert("削除しました。");
            ItemField.clear();
            dataDisplay(PlanDate);
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
        alert("作業計画ID" + tempStr);
        txtCd.focus();
        return false;
    }
    if (Chckflg == 1 && CheckValue == "") {
        alert("作業内容" + tempStr);
        txtDetail.focus();
        return false;
    }
    return true;
    if (Chckflg == 2 && CheckValue == "" ) {
        alert("作業予定日" + tempStr);
        sel1Cd.focus();
        return false;
    }
    return true;
}

//*
//* 作業計画日チェック
//*
function ChckDate(PlanDate) {
    if (PlanDate) {
    } else {
        txtPlanDate = document.getElementById("txtPlanDate");
        alert("予定日は必須です。");
        txtPlanDate.focus();
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

//*
//* 翌日日付をセットする
//*
function DayCalculate(TargetDay) {
    //時間差を求めて時間、分単位に変換する。
    var tD = Date.parse(TargetDay);
    var after=1;                             //1日加算する。
    after = after * 24 * 60 * 60 * 1000;     //加算日をミリ秒へ変換
    var wkTime = new Date(tD+after);
    var txtdate = new DateFormat("yyyy/MM/dd");
    var rtnDate = txtdate.format(new Date(wkTime));
    var rtn = rtnDate;
    return rtn;
}

//*****************************************************************************
//
// 追加機能
//
//******************************************************************************

//*
//*　前日分作業計画コピー
//*
function beforeDairyPlanCopy() {
    //報告日チェック
    var PlanDate = document.getElementById('txtPlanDate').value;
    var BefDay;
    if (ChckDate(PlanDate)) {
        var txtdate = new DateFormat("yyyy/MM/dd");
        txtdate = txtdate.format(new Date(PlanDate));
        BefDay = DaymainusCalculate(txtdate);
    } else {
        return;
    }

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
    //最大10日分確認
    var checker = existPlan(BefDay);
    alert("前日入力分の作業計画の内容を表示します。\n（前日分がなければ過去10日以内の入力データを表示します。）\n画面表示後に登録ボタンを押せば日報データベースに反映されます。");
    for (var i = 1; i <= 11; i++) {
        if (checker == true) {
            //作業計画表示
            dataDisplay(BefDay);
            break;
        }
        BefDay = DaymainusCalculate(BefDay);
        checker = existPlan(BefDay)
    }
}

//*
//*　レコードの存在確認
//*
function existPlan(PlanDate) {
    var EmpID = EmpCd;
    var mySql = " SELECT Count(WorkplanID) AS CountWid "
                + " FROM t_workplan "
                + " WHERE ( Empid ='" + EmpID + "') AND (PlanDate ='" + PlanDate + "')" 
                + "AND (DeleteFlg = '0');";
    var recordSet = database.Execute(mySql);
    var PlanCount = recordSet(0);
    if (PlanCount == 0) {
        return false;
    } else {
        return true;
    }
}


//*
//* 前日日付をセットする
//*
function DaymainusCalculate(TargetDay) {
    //時間差を求めて時間、分単位に変換する。
    var tD = Date.parse(TargetDay);
    var after = 1;                             //1日減算する。
    after = after * 24 * 60 * 60 * 1000;     //加算日をミリ秒へ変換
    var wkTime = new Date(tD - after);
    var txtdate = new DateFormat("yyyy/MM/dd");
    var rtnDate = txtdate.format(new Date(wkTime));
    var rtn = rtnDate;
    return rtn;
}