//-------------------------------------------------------------------
// ���O�C���p���W���[��
//  2013/6/XX  Ver1.0    Created By M.Nishimura
//�@2013/12/18          Ver1.3  �c�Ǝ��ԊǗ��@�\�ǉ� 
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


    EmpCdisplay();
//    dataDisplay();  
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //�o�^�p�����擾
    OperateDate = dateFormat.format(new Date());
}

function OperateEnd() {
//�I������
    dbClose();
    (window.open('', '_self').opener = window).close();
}


function EmpCdisplay() {
//�o�^����Ă���Ј���\������֐�
    var mySql = "SELECT * FROM m_Emp WHERE ( DeleteFlg Is Null) ORDER BY EmpID";
    var recordSet = database.Execute(mySql);
    //console.log(mySql);
    document.getElementById("EmpID").innerHTML = "";
    var tempHtml = "�S����ID�F�@<select name=\"selectEmpId\" id=\"selectEmpId\">\n";
    tempHtml = tempHtml + "\t<option value=\"0\">�I�����Ă��������B</option>\n";
    while (!recordSet.EOF) {
        tempHtml = tempHtml + "\t<option value=\"" + recordSet(0) + "\">" + recordSet(0) + "�F" + recordSet(1) + "</option>\n";
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

function selectEmpIdCdchange(obj) {
//�S���҃Z���N�g�{�b�N�X�X�V���̏���
    var workCd = obj.value;
    if (obj.selectedIndex == 0) {
        var selEmp = document.getElementById("EmpID");
        alert("�S���҂�I�����Ă��������B");
        selEmp.focus();
        return;
    } else {
        EmpCd = workCd;
    }
}

function winOpen(target_site){
//�Ј��R�[�h��n���č�ƌv���ʂɑJ��
    var selEmpid = document.getElementById("selectEmpId");
    if (selEmpid.selectedIndex == 0) {
        alert("�S���҂�I�����Ă��������B");
        selEmpid.focus();
        return;
    } else {
        var child = target_site + "?" + EmpCd;
//        subwin = window.open(child, "subWin", "top=50,left=500,width=1280");
        subwin = window.open(child, "subWin");
    }
}