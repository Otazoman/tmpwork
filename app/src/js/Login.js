//-------------------------------------------------------------------
// ���O�C���p���W���[��
//  2013/6/XX  Ver1.0    Created By M.Nishimura
//  2017/5/25  Ver1.1    ���t�@�N�^�����O
//
//  �@�\�F���O�C�����ɕK�v�ƂȂ��ʓ��̐�����s���B
//-------------------------------------------------------------------
var EmpCd;
var OperateDate;
onload = init;
onunload = dbClose;

function init() {
    //�����ݒ������֐�
    resizeTo(1280, 800);
    dbConnect(); //�f�[�^�x�[�X�ڑ�
    //��Ɨ\��E����o�^�����N�{�^������
    document.getElementById("linkTaskPlan").onclick = function() {
        winOpen("DailyPlanInput.html");
    }
    document.getElementById("linkDailyReport").onclick = function () {
        winOpen("DailyReport.html");
    }
    document.getElementById("linkReportView").onclick = function () {
        winOpen("DailyReportViewer.html");
    }
    document.getElementById("linkTasksum").onclick = function () {
        winOpen("DailyReportDownload.html");
    }
    document.getElementById("linkOvertimesum").onclick = function () {
        winOpen("OverTimeDownload.html");
    }


    EmpdataDisplay();  
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //�o�^�p�����擾
    OperateDate = dateFormat.format(new Date());
}

function OperateEnd() {
//�I������
    dbClose();
    (window.open('', '_self').opener = window).close();
}