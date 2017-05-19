//-------------------------------------------------------------------
// �S���҃}�X�^�o�^�p���W���[��
//  2013/5/16  Ver1.0    Created By M.Nishimura
//
//  �@�\�F�S���҃}�X�^����ɕK�v�ƂȂ��ʓ��̐�����s���B
//-------------------------------------------------------------------
var txtEmpCd;
var txtEmpName;
var OperateDate;
onload = init;
onunload = dbClose;

function init() {
    //�����ݒ������֐�
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
    dbConnect(); //�f�[�^�x�[�X�ڑ�
    dataDisplay();
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //�o�^�p�����擾
    OperateDate = dateFormat.format(new Date());
}

function OperateEnd() {
    //�I������
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
    //�f�[�^��\������֐�
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
    //�f�[�^��ǉ�����֐�
    try {
        if (dataCheck(1)) {
            var mySql = "INSERT INTO m_Emp ( EmpID ,EmpName ,Creationdate ) VALUES(" + "'" + txtEmpCd.value + "'" + ",'" + txtEmpName.value + "','" + OperateDate + "')";
            //      sqlDisplay(mySql);
            database.Execute(mySql);
            dataDisplay();
            alert("�ǉ����܂����B");
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataUpdate() {
    //�f�[�^���X�V����֐�
    try {
        if (dataCheck(1)) {
            var mySql = "UPDATE m_Emp SET EmpName ='" + txtEmpName.value + "', UpdateDate = '" + OperateDate + "' WHERE EmpID = '" + txtEmpCd.value + "'";
            //    sqlDisplay(mySql);
            database.Execute(mySql);
            dataDisplay();
            alert("�X�V���܂����B");
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataDelete() {
    //�f�[�^���폜����֐�
    try {
        if (dataCheck(0)) {
            var mySql = " UPDATE m_Emp SET DeleteFlg = '1', DeleteDate = '" + OperateDate + "' WHERE EmpID = '" + txtEmpCd.value + "'";
            //    sqlDisplay(mySql);
            database.Execute(mySql);
            dataDisplay();
            alert("�폜���܂����B");
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataCheck(flag) {
    //�f�[�^���`�F�b�N����֐�
    var tempStr = "�͕K�����͂��Ă��������B";
    if (txtEmpCd.value == "") {
        alert("�S����CD" + tempStr);
        return false;
    }
    if (txtEmpCd.value.match(/[^0-9]/)) {
        alert("�S����CD�ɂ͔��p��������͂��Ă��������I");
        txtEmpCd.focus();
        return false;
    }
    if (flag == 1 && txtEmpName.value == "") {
        alert("�S���Җ�" + tempStr);
        return false;
    }
    return true;
}

function EmpChange(obj) {
    txtEmpCd.value = obj.value;
    txtEmpName.value = obj.options[obj.selectedIndex].text;
}