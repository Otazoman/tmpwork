
//-------------------------------------------------------------------
// 従業員コード制御用
//  2017/5/25  Ver1.1    リファクタリングにより外部化
//-------------------------------------------------------------------

//登録されている社員を表示する関数
//*　ログイン画面で使用
//
function EmpdataDisplay() {
    var mySql = "SELECT * FROM m_Emp WHERE ( DeleteFlg Is Null) ORDER BY EmpID";
    var recordSet = database.Execute(mySql);
    //console.log(mySql);
    document.getElementById("EmpID").innerHTML = "";
    var tempHtml = "担当者ID：　<select name=\"selectEmpId\" id=\"selectEmpId\">\n";
    tempHtml = tempHtml + "\t<option value=\"0\">選択してください。</option>\n";
    while (!recordSet.EOF) {
        tempHtml = tempHtml + "\t<option value=\"" + recordSet(0) + "\">" + recordSet(0) + "：" + recordSet(1) + "</option>\n";
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + "</select>";
    //	console.log(tempHtml);
    document.getElementById("EmpID").innerHTML = tempHtml;
    var selEmpid = document.getElementById("selectEmpId");
    selEmpid.onchange = function () {
        selectEmpIdCdchange(this);
    }
    selEmpid.focus();
    recordSet.Close();
    recordSet = null;
}


//* 登録されている社員を表示する
//*        EmpCdisplay("Empid");
//*        引数に指定された従業員コードから社員セレクトボックスを表示する。
function EmpCdisplay(loginId) {
    var mySql = "SELECT * FROM m_Emp WHERE ( DeleteFlg Is Null) ORDER BY EmpID";
    var recordSet = database.Execute(mySql);
    //console.log(mySql);
    document.getElementById("EmpID").innerHTML = "";
    var tempHtml = "担当者ID：　<select name=\"selectEmpId\" id=\"selectEmpId\">\n";
    tempHtml = tempHtml + "\t<option value=\"0\">選択してください。</option>\n";
    while (!recordSet.EOF) {
        var optionval = recordSet(0);
        //オプション値指定がある場合はそのオプションを選択状態にする。
        if (optionval == loginId) {
            tempHtml = tempHtml + '\t<option value="' + optionval + '" selected >' + recordSet(0) + "：" + recordSet(1) + '<\/option>\n';
        } else {
            tempHtml = tempHtml + '\t<option value="' + optionval + '"\">' + recordSet(0) + "：" + recordSet(1) + '<\/option>\n';
        }
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + "</select>";
    document.getElementById("EmpID").innerHTML = tempHtml;
    selEmpid = document.getElementById("selectEmpId");
    selEmpid.onchange = function () {
        selectEmpIdCdchange(selEmpid);
    }
    recordSet.Close();
    recordSet = null;
}

//
// 従業員コード選択時の動作
// 担当者セレクトボックス更新時の処理
function selectEmpIdCdchange(obj) {
    var workCd = obj.value;
    if (obj.selectedIndex == 0) {
        var selEmp = document.getElementById("EmpID");
        alert("担当者を選択してください。");
        selEmp.focus();
        return;
    } else {
        EmpCd = workCd;
    }
}


//社員コードを渡して別画面に遷移
//
function winOpen(target_site){
    var selEmpid = document.getElementById("EmpID");
    if (selEmpid.selectedIndex == 0) {
        alert("担当者を選択してください。");
        selEmpid.focus();
        return;
    } else {
        var child = target_site + "?" + EmpCd;
        subwin = window.open(child, "subWin");
    }
}