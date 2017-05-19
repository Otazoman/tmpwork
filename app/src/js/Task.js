//-------------------------------------------------------------------
// 作業マスタ登録用モジュール
//  2013/5/21  Ver1.0    Created By M.Nishimura
//
//  機能：作業マスタ制御に必要となる画面等の制御を行う。
//-------------------------------------------------------------------
var txtTaskCd;
var txtTaskName;
var OperateDate;
onload = init;
onunload = dbClose;

function init() {
    //初期設定をする関数
    resizeTo(500, 650);
    txtTaskCd = document.getElementById("txtTaskCd");
    txtTaskName = document.getElementById("txtTaskName");
    txtTaskCd.onblur = function() {
        blur(this);
    }
    txtTaskCd.onfocus = function() {
        focus(this);
    }
    txtTaskName.onblur = function() {
        blur(this);
    }
    txtTaskName.onfocus = function() {
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
    document.getElementById("linkMaxCd").onclick = function() {
        return maxCd();
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
    var mySql = "SELECT * FROM m_Task WHERE ( DeleteFlg Is Null) ORDER BY TaskID";
    var recordSet = database.Execute(mySql);
    document.getElementById("dataDisplay").innerHTML = "";
    var tTaskHtml = "<select size=\"25\" name=\"selectTask\" id=\"selectTask\">\n";
    while (!recordSet.EOF) {
        tTaskHtml = tTaskHtml + "\t<option value=\"" + recordSet(0) + "\">" + recordSet(1) + "</option>\n";
        recordSet.MoveNext();
    }
    tTaskHtml = tTaskHtml + "</select>";
    document.getElementById("dataDisplay").innerHTML = tTaskHtml;
    document.getElementById("selectTask").onchange = function() {
        TaskChange(this);
    }
    recordSet.Close();
    recordSet = null;
}

function dataInsert() {
    //データを追加する関数
    try {
        if (dataCheck(1)) {
            var mySql = "INSERT INTO m_Task ( TaskID ,taskName ,Creationdate ) VALUES(" + +Number(txtTaskCd.value) + ",'" + txtTaskName.value + "','" + OperateDate + "')";
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
            var mySql = "UPDATE m_Task SET TaskName ='" + txtTaskName.value + "', UpdateDate = '" + OperateDate + "' WHERE TaskID = " + Number(txtTaskCd.value);
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
            var mySql = " UPDATE m_Task SET DeleteFlg = '1', DeleteDate = '" + OperateDate + "' WHERE TaskID = " + Number(txtTaskCd.value);
            //    sqlDisplay(mySql);
            database.Execute(mySql);
            dataDisplay();
            alert("削除しました。");
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}
//function sqlDisplay(_mySql) {
//  //SQLを表示する関数
//  document.getElementById("sqlDisplay").innerHTML = "<p>" + _mySql + "</p>";
//}

function dataCheck(flag) {
    //データをチェックする関数
    var tTaskStr = "は必ず入力してください。";
    if (txtTaskCd.value == "") {
        alert("作業CD" + tTaskStr);
        return false;
    }
    if (txtTaskCd.value.match(/[^0-9]/)) {
        alert("作業CDには半角数字を入力してください！");
        txtTaskCd.focus();
        return false;
    }
    if (flag == 1 && txtTaskName.value == "") {
        alert("作業内容" + tTaskStr);
        return false;
    }
    return true;
}

function maxCd() {
    //最大値を取得する関数
    var mySql = "SELECT MAX(TaskID) FROM m_Task";
    var recordSet = database.Execute(mySql);
    var MaxTaskCd
    MaxTaskCd = recordSet(0);
    txtTaskCd.value = Number(MaxTaskCd) + 1;
    txtTaskName.value = "";
    txtTaskName.focus();
    return false;
}

function TaskChange(obj) {
    txtTaskCd.value = obj.value;
    txtTaskName.value = obj.options[obj.selectedIndex].text;
}