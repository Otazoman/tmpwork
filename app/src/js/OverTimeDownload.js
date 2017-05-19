//-------------------------------------------------------------------
// �c�Ǝ��ԃ_�E�����[�h�p���W���[��
//  2013/12/18  Ver1.0    Created By M.Nishimura
//  2017/3/2    Ver1.1    �w�b�_�Œ�Ή�(�����R�[�h�ł̓w�b�_�����o�͂���Ȃ��Ȃ�������)
//  2017/3/9    Ver1.2    ���t�@�N�^�����O
//                       (���t�֘A�A�]�ƈ��R�[�h�֘A�A�f�[�^�_�E�����[�h�֘A�֐��𕪗�)
//
//  �@�\�F�ۑ�����Ă���c�Ǝ��Ԗ��׃f�[�^���_�E�����[�h����B
//-------------------------------------------------------------------

var EmpCd = location.search.substring(1);     //���O�C����ʂ���S����CD�擾

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
    //�c�Ǝ��Ԍ����{�^������
    document.getElementById("btnDaySearch").onclick = function () {
        txtDateUpdate(txtReportdayF);
    }
    //��ʃ_�E�����[�h�{�^������
    document.getElementById("btnViewDownload").onclick = function () {
        ViewDownload("download_overTimeview.csv");
    }
    //�S���_�E�����[�h�{�^������
    document.getElementById("btnAllDownload").onclick = function () {
        OverTimeDownload();
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
//*�@�񍐓��Ɏc�Ǝ��ԓo�^�����݂��邩�𔻕ʂ��ĕ\������
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
    //�c�Ǝ��Ԃ̓o�^���Ȃ���Ή�ʂ��N���A����
    if(ret == 0){
        TableClear();
    }
   //�c�Ǝ��Ԃ̓o�^������΃f�[�^��\������B    
    if (ret != 0) {
        TableClear();
        //��ʕ\���pSQL
        var drawsql = " SELECT t_Overtime.Empid, m_Emp.Empname, t_Overtime.Workday, t_Overtime.CauseID, m_Cause.CauseMemo, t_Overtime.Memo, t_Overtime.Planhours, t_Overtime.Workinghours "
                        + " FROM (t_Overtime INNER JOIN m_Emp ON t_Overtime.Empid = m_Emp.Empid) INNER JOIN m_Cause ON t_Overtime.CauseID = m_Cause.CauseID "
                        + " WHERE ((t_Overtime.Workday)>='" + ReportdayF + "' AND (t_Overtime.Workday)<='" + ReportdayT + "') AND ((m_Cause.DeleteFlg)='0') AND ((t_Overtime.Empid)='" + EmpID + "') "
                        + " ORDER BY t_Overtime.Workday; ";
        DataDisplay(drawsql,arryCount);
    }
}

//*
//*�@�S���_�E�����[�h(�S���҈ȊO��)
//*
function OverTimeDownload(){
            var filename = "download_overTimeAll.csv";
            var arrayCount = 7;
            var outputFile = "";
            //�^�C�g������
            outputFile = outputFile + "\"" + "�S����CD" + "\"" + ",";
            outputFile = outputFile + "\"" + "�S���Җ�" + "\"" + ",";
            outputFile = outputFile + "\"" + "��Ɠ�" + "\"" + ",";
            outputFile = outputFile + "\"" + "�c�Ɨ��R�R�[�h" + "\"" + ",";
            outputFile = outputFile + "\"" + "�c�Ɨ��R" + "\"" + ",";
            outputFile = outputFile + "\"" + "�c�Ɨ��R�⑫" + "\"" + ",";
            outputFile = outputFile + "\"" + "�c�Ɛ\������" + "\"" + ",";
            outputFile = outputFile + "\"" + "�c�Ǝ��ю���" + "\"" + "\n";
            //�c�Ǝ��ԕ���
            var ReportdayF = document.getElementById('txtReportdayF').value;
            var ReportdayT = document.getElementById('txtReportdayT').value;
            //���������`�F�b�N
            var rtnc = txtDayCheacker();
            if (!rtnc){
                return;
            }
            var mysql = " SELECT t_Overtime.Empid, m_Emp.Empname, t_Overtime.Workday, t_Overtime.CauseID, m_Cause.CauseMemo, t_Overtime.Memo, t_Overtime.Planhours, t_Overtime.Workinghours "
                        + " FROM (t_Overtime INNER JOIN m_Emp ON t_Overtime.Empid = m_Emp.Empid) INNER JOIN m_Cause ON t_Overtime.CauseID = m_Cause.CauseID "
                        + " WHERE (((t_Overtime.Workday)>='" + ReportdayF + "' And (t_Overtime.Workday)<='" + ReportdayT + "') AND ((m_Cause.DeleteFlg)='0')) "
                        + " ORDER BY t_Overtime.Empid, t_Overtime.Workday; ";
            AllDownload(filename,outputFile,mysql,arrayCount);
}