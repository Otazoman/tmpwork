//-------------------------------------------------------------------
// ��ƃ}�X�^�o�^�p���W���[��
//  2013/5/21  Ver1.0    Created By M.Nishimura
//
//  �@�\�F��ƃ}�X�^����ɕK�v�ƂȂ��ʓ��̐�����s���B
//-------------------------------------------------------------------
var txtTaskCd;
var txtTaskName;
var OperateDate;
onload = init;
onunload = dbClose;

function init() {
    //�����ݒ������֐�
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
    //�f�[�^��ǉ�����֐�
    try {
        if (dataCheck(1)) {
            var mySql = "INSERT INTO m_Task ( TaskID ,taskName ,Creationdate ) VALUES(" + +Number(txtTaskCd.value) + ",'" + txtTaskName.value + "','" + OperateDate + "')";
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
            var mySql = "UPDATE m_Task SET TaskName ='" + txtTaskName.value + "', UpdateDate = '" + OperateDate + "' WHERE TaskID = " + Number(txtTaskCd.value);
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
            var mySql = " UPDATE m_Task SET DeleteFlg = '1', DeleteDate = '" + OperateDate + "' WHERE TaskID = " + Number(txtTaskCd.value);
            //    sqlDisplay(mySql);
            database.Execute(mySql);
            dataDisplay();
            alert("�폜���܂����B");
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}
//function sqlDisplay(_mySql) {
//  //SQL��\������֐�
//  document.getElementById("sqlDisplay").innerHTML = "<p>" + _mySql + "</p>";
//}

function dataCheck(flag) {
    //�f�[�^���`�F�b�N����֐�
    var tTaskStr = "�͕K�����͂��Ă��������B";
    if (txtTaskCd.value == "") {
        alert("���CD" + tTaskStr);
        return false;
    }
    if (txtTaskCd.value.match(/[^0-9]/)) {
        alert("���CD�ɂ͔��p��������͂��Ă��������I");
        txtTaskCd.focus();
        return false;
    }
    if (flag == 1 && txtTaskName.value == "") {
        alert("��Ɠ��e" + tTaskStr);
        return false;
    }
    return true;
}

function maxCd() {
    //�ő�l���擾����֐�
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