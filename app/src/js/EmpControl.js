
//-------------------------------------------------------------------
// �]�ƈ��R�[�h����p
//  2017/5/25  Ver1.1    ���t�@�N�^�����O�ɂ��O����
//-------------------------------------------------------------------

//�o�^����Ă���Ј���\������֐�
//*�@���O�C����ʂŎg�p
//
function EmpdataDisplay() {
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


//* �o�^����Ă���Ј���\������
//*        EmpCdisplay("Empid");
//*        �����Ɏw�肳�ꂽ�]�ƈ��R�[�h����Ј��Z���N�g�{�b�N�X��\������B
function EmpCdisplay(loginId) {
    var mySql = "SELECT * FROM m_Emp WHERE ( DeleteFlg Is Null) ORDER BY EmpID";
    var recordSet = database.Execute(mySql);
    //console.log(mySql);
    document.getElementById("EmpID").innerHTML = "";
    var tempHtml = "�S����ID�F�@<select name=\"selectEmpId\" id=\"selectEmpId\">\n";
    tempHtml = tempHtml + "\t<option value=\"0\">�I�����Ă��������B</option>\n";
    while (!recordSet.EOF) {
        var optionval = recordSet(0);
        //�I�v�V�����l�w�肪����ꍇ�͂��̃I�v�V������I����Ԃɂ���B
        if (optionval == loginId) {
            tempHtml = tempHtml + '\t<option value="' + optionval + '" selected >' + recordSet(0) + "�F" + recordSet(1) + '<\/option>\n';
        } else {
            tempHtml = tempHtml + '\t<option value="' + optionval + '"\">' + recordSet(0) + "�F" + recordSet(1) + '<\/option>\n';
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
// �]�ƈ��R�[�h�I�����̓���
// �S���҃Z���N�g�{�b�N�X�X�V���̏���
function selectEmpIdCdchange(obj) {
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


//�Ј��R�[�h��n���ĕʉ�ʂɑJ��
//
function winOpen(target_site){
    var selEmpid = document.getElementById("EmpID");
    if (selEmpid.selectedIndex == 0) {
        alert("�S���҂�I�����Ă��������B");
        selEmpid.focus();
        return;
    } else {
        var child = target_site + "?" + EmpCd;
        subwin = window.open(child, "subWin");
    }
}