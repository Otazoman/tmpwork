//-------------------------------------------------------------------
// 担当者マスタ登録用モジュール
//  2013/5/16  Ver1.0    Created By M.Nishimura
//
//  機能：担当者マスタ制御に必要となる画面等の制御を行う。
//-------------------------------------------------------------------
var txtEmpCd;
var txtEmpName;
var OperateDate;
onload = init;
onunload = dbClose;

function init() {
    //初期設定をする関数
    resizeTo(500, 650);
    txtEmpCd = document.getElementById("txtEmpCd");
    txtEmpName = document.getElementById("txtEmpName");
    txtEmpCd.onblur = function() {
        blur(this);
    }
    txtEmpCd.onfocus = function() {
        focus(this);
    }
    txtEmpName.onblur = function() {
        blur(this);
    }
    txtEmpName.onfocus = function() {
        focus(this);
    }
    document.getElementById("btnInsert").onclick = function() {
        dataInsert();
    }
    document.getElementById("btnUpdate").onclick = function() {
        dataUpdate();
    }
    document.getElementById("btnDelete").onclick = function() {
        dataDelete();
    }
    document.getElementById("linkLogOut").onclick = function() {
        OperateEnd();
    }
    dbConnect(); //データベース接続
    dataDisplay();
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //登録用日時取得
    OperateDate = dateFormat.format(new Date());
}

function OperateEnd() {
    //終了処理
    dbClose();
    (window.open('', '_self').opener = window).close();
}

function focus(obj) {
    obj.style.backgroundColor = "#ffff00";
}

function blur(obj) {
    obj.style.backgroundColor = "#ffffff";
}

function dataDisplay() {
    //データを表示する関数
    var mySql = "SELECT * FROM m_Emp WHERE ( DeleteFlg Is Null) ORDER BY EmpID";
    var recordSet = database.Execute(mySql);
    document.getElementById("dataDisplay").innerHTML = "";
    var tempHtml = "<select size=\"25\" name=\"selectEmp\" id=\"selectEmp\">\n";
    while (!recordSet.EOF) {
        tempHtml = tempHtml + "\t<option value=\"" + recordSet(0) + "\">" + recordSet(1) + "</option>\n";
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + "</select>";
    document.getElementById("dataDisplay").innerHTML = tempHtml;
    document.getElementById("selectEmp").onchange = function() {
        EmpChange(this);
    }
    recordSet.Close();
    recordSet = null;
}

function dataInsert() {
    //データを追加する関数
    try {
        if (dataCheck(1)) {
            var mySql = "INSERT INTO m_Emp ( EmpID ,EmpName ,Creationdate ) VALUES(" + "'" + txtEmpCd.value + "'" + ",'" + txtEmpName.value + "','" + OperateDate + "')";
            //      sqlDisplay(mySql);
            database.Execute(mySql);
            dataDisplay();
            alert("追加しました。");
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataUpdate() {
    //データを更新する関数
    try {
        if (dataCheck(1)) {
            var mySql = "UPDATE m_Emp SET EmpName ='" + txtEmpName.value + "', UpdateDate = '" + OperateDate + "' WHERE EmpID = '" + txtEmpCd.value + "'";
            //    sqlDisplay(mySql);
            database.Execute(mySql);
            dataDisplay();
            alert("更新しました。");
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataDelete() {
    //データを削除する関数
    try {
        if (dataCheck(0)) {
            var mySql = " UPDATE m_Emp SET DeleteFlg = '1', DeleteDate = '" + OperateDate + "' WHERE EmpID = '" + txtEmpCd.value + "'";
            //    sqlDisplay(mySql);
            database.Execute(mySql);
            dataDisplay();
            alert("削除しました。");
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataCheck(flag) {
    //データをチェックする関数
    var tempStr = "は必ず入力してください。";
    if (txtEmpCd.value == "") {
        alert("担当者CD" + tempStr);
        return false;
    }
    if (txtEmpCd.value.match(/[^0-9]/)) {
        alert("担当者CDには半角数字を入力してください！");
        txtEmpCd.focus();
        return false;
    }
    if (flag == 1 && txtEmpName.value == "") {
        alert("担当者名" + tempStr);
        return false;
    }
    return true;
}

function EmpChange(obj) {
    txtEmpCd.value = obj.value;
    txtEmpName.value = obj.options[obj.selectedIndex].text;
}