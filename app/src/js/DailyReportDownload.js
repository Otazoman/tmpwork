//-------------------------------------------------------------------
// ����_�E�����[�h�p���W���[��
//  2013/6/27  Ver1.0    Created By M.Nishimura
//  2013/11/25 �S���_�E�����[�h���s��C��  Modified By M.Nishimura
//  2017/3/2   Ver1.4    �w�b�_�Œ�Ή�(�����R�[�h�ł̓w�b�_�����o�͂���Ȃ��Ȃ�������)
//  2017/3/9   Ver1.5    ���t�@�N�^�����O(���t�֘A�A�]�ƈ��R�[�h�֘A�֐��𕪗�)
//
//  �@�\�F�ۑ�����Ă�����񖾍׃f�[�^���_�E�����[�h����B
//-------------------------------------------------------------------

var EmpCd=location.search.substring(1);     //���O�C����ʂ���S����CD�擾

onload = init;
onunload = dbClose;

//*
//*�@�����ݒ������֐�
//*
function init() {

    //������(��)�A������(��)�\��
    var txtdate = new DateFormat("yyyy/MM/dd");
    txtdate = txtdate.format(new Date());
    txtReportdayF = document.getElementById("txtReportdayF");
    FromDaySet(txtReportdayF);
    
    txtReportdayT = document.getElementById("txtReportdayT");
    var NextDay = DayCalculate(txtdate);
    txtReportdayT.value = NextDay;
    //�������̃e�L�X�g�{�b�N�X����
    txtReportdayF.onblur = function () {
        this.style.backgroundColor = "#ffffff";
    }
    txtReportdayT.onblur = function () {
        this.style.backgroundColor = "#ffffff";
    }
    //���񌟍��{�^������
    document.getElementById("btnDaySearch").onclick = function () {
        txtDateUpdate(txtReportdayF);
    }
    //��ʃ_�E�����[�h�{�^������
    document.getElementById("btnViewDownload").onclick = function () {
        ViewDownload("download_Dailyview.csv");
    }
    //�S���_�E�����[�h�{�^������
    document.getElementById("btnAllDownload").onclick = function () {
        AllDownload()
    }
    dbConnect(); //�f�[�^�x�[�X�ڑ�
    // �S���҂��Z�b�g���ĉ�ʂ̏����\��
    EmpCdisplay(EmpCd);
    Drawdata();
}

//*
//*�@�I������
//*
function OperateEnd() {
    dbClose();
    (window.open('', '_self').opener = window).close();
}

//*
//*�@�񍐓��X�V���̏���
//*
function txtDateUpdate(obj) {
    Drawdata();
    obj.style.backgroundColor = "#ffffff";
}

//*
//*�@�񍐓��ɓ���o�^�����݂��邩�𔻕ʂ��ĕ\������֐�
//*
function Drawdata() {
    var EmpID = EmpCd;
    var arryCount = 9;
    //�񍐓��`�F�b�N
    var ReportdayF = document.getElementById('txtReportdayF').value;
    var ReportdayT = document.getElementById('txtReportdayT').value;
    var rtnc = txtDayCheacker();
    if (!rtnc){
        return;
    }
    //�����`�F�b�N
    var countsql = " SELECT COUNT(WorkplanID) AS WIDCount" + " FROM t_workplan"
                 + " WHERE (PlanDate >='" + ReportdayF + "' AND PlanDate <= '" + ReportdayT + "') AND (Empid='" + EmpID + "') AND (DeleteFlg = '0' );";
    var ret = DisPlayChecker(countsql)
    //����̓o�^���Ȃ���Ή�ʂ��N���A����
    if(ret == 0){
        TableClear();
    }
   //����̓o�^������΃f�[�^��\������B    
    if (ret != 0) {
        TableClear();
        dataDisplay();
    }
}

//*
//*�@����f�[�^��\������֐�(2�̃f�[�^�����Z���ĕ\�������Ă���̂Ő؏o�s��)
//*
function dataDisplay() {
    try {
        var EmpId = EmpCd;
        //��ƌv��o�^�Ȃ�
        var cWork = "�|";
        var ReportdayF = document.getElementById('txtReportdayF').value;
        var ReportdayT = document.getElementById('txtReportdayT').value;
        //���������`�F�b�N
        var rtnc = txtDayCheacker();
        if (!rtnc){
            return;
        }
        var mySql = " SELECT t_dailyreport.ReportID, t_dailyreport.WorkplanID, m_Administration.AdministrationID, m_Administration.AdministrationDetail,"
                    + " m_ActionPlan.ActionplanID, m_ActionPlan.ActionPlan, m_Matter.MatterID, m_Matter.MatterName, m_Task.TaskID, m_Task.taskName,"
                    + " t_dailyreport.Dailymemo, t_dailyreport.Reference, t_dailyreport.Reportday, t_dailyreport.Taskstart, t_dailyreport.Taskend,"
                    + " t_dailyreport.Workinghours, m_Emp.Empid, m_Emp.Empname"
                    + " FROM m_Emp INNER JOIN ((t_dailyreport INNER JOIN (((m_Administration INNER JOIN m_ActionPlan ON m_Administration.AdministrationID = m_ActionPlan.AdministrationID)"
                    + " INNER JOIN m_Matter ON (m_Matter.AdministrationID = m_Administration.AdministrationID) AND (m_ActionPlan.ActionplanID = m_Matter.ActionplanID))"
                    + " INNER JOIN m_Businessyear ON m_Administration.Businessyear = m_Businessyear.BusinessYear) ON (t_dailyreport.MatterID = m_Matter.MatterID)"
                    + " AND (t_dailyreport.ActionplanID = m_ActionPlan.ActionplanID) AND (t_dailyreport.AdministrationID = m_Administration.AdministrationID))"
                    + " INNER JOIN m_Task ON t_dailyreport.TaskID = m_Task.TaskID) ON m_Emp.Empid = t_dailyreport.Empid"
                    + " WHERE (((t_dailyreport.Reportday)>='" + ReportdayF + "' AND (t_dailyreport.Reportday) <= '" + ReportdayT + "') AND ((m_Emp.Empid)='" + EmpId + "')"
                    + " AND ((t_dailyreport.DeleteFlg)='0') AND ((m_Businessyear.ShowFlg)='0')) ORDER BY t_dailyreport.Reportday DESC,t_dailyreport.ReportID;";
        var recordSet = database.Execute(mySql);
        //alert(mySql);
        console.log(mySql);
        var counter = 1;
        while (!recordSet.EOF) {
            var table1 = document.getElementById("table1");
            var row1 = table1.insertRow(counter);
            var outhtml = new Array(19);
            var cellname = new Array(19);
            //���񖾍ו\��
            for (var i = 0; i < 18; i++) {
                var classname = String('D' + i);
                //���̂܂܃��R�[�h�\��
                if (i ==0 || i == 1){
                    cellname[i] = row1.insertCell(i);
                    cellname[i].setAttribute("class", classname);
                    cellname[i].className = classname;
                    outhtml[i] = '<span id="' + classname + '-' + counter + '">' + recordSet(i) + '</span>';
                    cellname[i].innerHTML = outhtml[i];
                }
                //��ƌv��\��
                if (i == 2) {
                    var WPMemo = "";
                    if (recordSet(1) == cWork || recordSet(1) == null || recordSet(1) == undefined) {
                        cellname[i] = row1.insertCell(i);
                        cellname[i].setAttribute("class", classname);
                        cellname[i].className = classname;
                        WPMemo = cWork;
                        outhtml[i] = '<span id="' + classname + '-' + counter + '">' + WPMemo + '</span>';
                    } else {
                        mySubSql = " SELECT t_workplan.WorkplanID, t_workplan.Planmemo, t_workplan.Empid, t_workplan.PlanDate, t_dailyreport.Reportday "
                                  + " FROM t_dailyreport INNER JOIN t_workplan ON (t_dailyreport.MatterID = t_workplan.MatterID) AND (t_dailyreport.ActionplanID = t_workplan.ActionplanID)"
                                  + " AND (t_dailyreport.AdministrationID = t_workplan.AdministrationID) AND (t_dailyreport.WorkplanID = t_workplan.WorkplanID)"
                                  + " WHERE (((t_workplan.WorkplanID)='" + recordSet(1) + "') AND ((t_workplan.Empid)='" + EmpId + "') AND ((t_workplan.PlanDate)='" + recordSet(12) + "') AND (t_workplan.DeleteFlg='0'));";
                        SubrecordSet = database.Execute(mySubSql);
                        //alert(mySubSql);
                        //console.log(mySubSql);
                        cellname[i] = row1.insertCell(i);
                        cellname[i].setAttribute("class", classname);
                        cellname[i].className = classname;
                        var WPMemo = SubrecordSet(1);
                        outhtml[i] = '<span id="' + classname + '-' + counter + '">' + WPMemo + '</span>';
                        cellname[i].innerHTML = outhtml[i];
                        SubrecordSet.Close();
                        SubrecordSet = null;
                    }
                }
                //1�񂸂��̂ŕ\���ӏ��𒲐�
                if (i >= 2) {
                    var k = i + 1;
                    cellname[k] = row1.insertCell(k);
                    cellname[k].setAttribute("class", classname);
                    cellname[k].className = classname;
                    outhtml[k] = '<span id="' + classname + '-' + counter + '">' + recordSet(i) + '</span>';
                    cellname[k].innerHTML = outhtml[k];
                }
            }
            recordSet.MoveNext();
            counter++;
        }
        recordSet.Close();
        recordSet = null;
    } catch(error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*  �S���_�E�����[�h(2�̃f�[�^�����Z���ĕ\�������Ă���̂Ő؏o�s��)
//*
function AllDownload() {
    if (window.confirm('���񖾍ׂ̑S���f�[�^���_�E�����[�h���܂��B\n��낵���ł����H')) {
        try {
            //�e�L�X�g�t�@�C�����f�X�N�g�b�v�ɕۑ�
            var fs = new ActiveXObject("Scripting.FileSystemObject");
            var outf = fs.CreateTextFile("download_DailyAll.csv", true);
            var outputFile = "";
            //��ƌv��o�^�Ȃ�
            var cWork = "�|";
            //�^�C�g������
            outputFile = outputFile + "\"" + "����ID" + "\"" + ",";
            outputFile = outputFile + "\"" + "��ƌv��ID" + "\"" + ",";
            outputFile = outputFile + "\"" + "��ƌv��" + "\"" + ",";
            outputFile = outputFile + "\"" + "��{���jID" + "\"" + ",";
            outputFile = outputFile + "\"" + "��{���j" + "\"" + ",";
            outputFile = outputFile + "\"" + "�s���v��ID" + "\"" + ",";
            outputFile = outputFile + "\"" + "�s���v��" + "\"" + ",";
            outputFile = outputFile + "\"" + "�Č�ID" + "\"" + ",";
            outputFile = outputFile + "\"" + "�Č���" + "\"" + ",";
            outputFile = outputFile + "\"" + "���ID" + "\"" + ",";
            outputFile = outputFile + "\"" + "��Ɩ�" + "\"" + ",";
            outputFile = outputFile + "\"" + "���сE�⑫" + "\"" + ",";
            outputFile = outputFile + "\"" + "�֘A����" + "\"" + ",";
            outputFile = outputFile + "\"" + "��Ɠ�" + "\"" + ",";
            outputFile = outputFile + "\"" + "��ƊJ�n" + "\"" + ",";
            outputFile = outputFile + "\"" + "��ƏI��" + "\"" + ",";
            outputFile = outputFile + "\"" + "��Ǝ���" + "\"" + ",";
            outputFile = outputFile + "\"" + "�S����CD" + "\"" + ",";
            outputFile = outputFile + "\"" + "�S���Җ�" + "\"" + "\n";
            //�������`�F�b�N
            var ReportdayF = document.getElementById('txtReportdayF').value;
            var ReportdayT = document.getElementById('txtReportdayT').value;
            var rtnc = txtDayCheacker();
            if (!rtnc){
                return;
            }

            var mySql = " SELECT t_dailyreport.ReportID, t_dailyreport.WorkplanID, m_Administration.AdministrationID, m_Administration.AdministrationDetail,"
                    + " m_ActionPlan.ActionplanID, m_ActionPlan.ActionPlan, m_Matter.MatterID, m_Matter.MatterName, m_Task.TaskID, m_Task.taskName,"
                    + " t_dailyreport.Dailymemo, t_dailyreport.Reference, t_dailyreport.Reportday, t_dailyreport.Taskstart, t_dailyreport.Taskend,"
                    + " t_dailyreport.Workinghours, m_Emp.Empid, m_Emp.Empname"
                    + " FROM m_Emp INNER JOIN ((t_dailyreport INNER JOIN (((m_Administration INNER JOIN m_ActionPlan ON m_Administration.AdministrationID = m_ActionPlan.AdministrationID)"
                    + " INNER JOIN m_Matter ON (m_Matter.AdministrationID = m_Administration.AdministrationID) AND (m_ActionPlan.ActionplanID = m_Matter.ActionplanID))"
                    + " INNER JOIN m_Businessyear ON m_Administration.Businessyear = m_Businessyear.BusinessYear) ON (t_dailyreport.MatterID = m_Matter.MatterID)"
                    + " AND (t_dailyreport.ActionplanID = m_ActionPlan.ActionplanID) AND (t_dailyreport.AdministrationID = m_Administration.AdministrationID))"
                    + " INNER JOIN m_Task ON t_dailyreport.TaskID = m_Task.TaskID) ON m_Emp.Empid = t_dailyreport.Empid"
                    + " WHERE ((t_dailyreport.Reportday)>='" + ReportdayF + "' AND (t_dailyreport.Reportday) <= '" + ReportdayT + "')"
                    + " AND (t_dailyreport.DeleteFlg='0') AND (m_Businessyear.ShowFlg='0') " 
                    + "ORDER BY t_dailyreport.Reportday DESC,t_dailyreport.ReportID;";
            var recordSet = database.Execute(mySql);
            //alert(mySql);
            //console.log(mySql);
            var counter = 1;
            while (!recordSet.EOF) {
                //���񖾍�
                for (var i = 0; i < 18; i++) {
                    //���̂܂܃��R�[�h�o��
                    if (i == 0 || i == 1) {
                        outputFile = outputFile + "\"" + recordSet(i) + "\"" + ",";
                    }
                    //��ƌv��
                    if (i == 2) {
                        var WPMemo = "";
                        if (recordSet(1) == cWork || recordSet(1) == null || recordSet(1) == undefined) {
                            outputFile = outputFile + "\"" + cWork + "\"" + ",";
                        } else {
                            mySubSql = " SELECT t_workplan.WorkplanID, t_workplan.Planmemo, t_workplan.Empid, t_workplan.PlanDate, t_dailyreport.Reportday "
                                  + " FROM t_dailyreport INNER JOIN t_workplan ON (t_dailyreport.MatterID = t_workplan.MatterID) AND (t_dailyreport.ActionplanID = t_workplan.ActionplanID)"
                                  + " AND (t_dailyreport.AdministrationID = t_workplan.AdministrationID) AND (t_dailyreport.WorkplanID = t_workplan.WorkplanID)"
                                  + " WHERE (((t_workplan.WorkplanID)='" + recordSet(1) + "') AND ((t_workplan.Empid)='" + recordSet(16) + "') AND ((t_workplan.PlanDate)='" + recordSet(12) + "') AND (t_workplan.DeleteFlg='0'));";
                            SubrecordSet = database.Execute(mySubSql);
                            //console.log(mySubSql);
                            outputFile = outputFile + "\"" + SubrecordSet(1) + "\"" + ",";
                            SubrecordSet.Close();
                            SubrecordSet = null;
                        }
                    }
                    if (i >= 3) {
                        var k = i - 1;
                        outputFile = outputFile + "\"" + recordSet(k) + "\"" + ",";
                    }
                    //�ŏI�J�����̏ꍇ�͉��s
                    if (i == 17) {
                        outputFile = outputFile + "\"" + recordSet(i) + "\"" + "\n";
                    }
                }
                recordSet.MoveNext();
                counter++;
            }
            outf.Write(outputFile);
        } catch (error) {
            alert(error.number + "\n" + error.description);
        } finally {
            recordSet.Close();
            recordSet = null;
            alert("�f�X�N�g�b�v�Ƀt�@�C����ۑ����܂����B");
            outf.Close();
        }
    } else {
        alert("�_�E�����[�h���L�����Z�����܂����B");
    }
}