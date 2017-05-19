//*--------------------------------------------------------------------------
//*
//* 登録されている社員を表示する
//*        EmpCdisplay("Empid");
//*        引数に指定された従業員コードから社員セレクトボックスを表示する。
//*
//*--------------------------------------------------------------------------
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

// 従業員コード選択時の動作
function selectEmpIdCdchange(obj) {
//担当者セレクトボックス更新時の処理
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


function winOpen(target_site){
//社員コードを渡して作業計画画面に遷移
    var selEmpid = document.getElementById("EmpID");
    if (selEmpid.selectedIndex == 0) {
        alert("担当者を選択してください。");
        selEmpid.focus();
        return;
    } else {
        var child = target_site + "?" + EmpCd;
//        subwin = window.open(child, "subWin", "top=50,left=500,width=1280");
        subwin = window.open(child, "subWin");
    }
}