//*--------------------------------------------------------------------------
//*
//* �o�^����Ă���Ј���\������
//*        EmpCdisplay("Empid");
//*        �����Ɏw�肳�ꂽ�]�ƈ��R�[�h����Ј��Z���N�g�{�b�N�X��\������B
//*
//*--------------------------------------------------------------------------
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

// �]�ƈ��R�[�h�I�����̓���
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
    var selEmpid = document.getElementById("EmpID");
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