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
