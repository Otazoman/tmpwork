//-------------------------------------------------------------------
// �s���v��o�^�p���W���[��
//  2013/5/25  Ver1.0    Created By M.Nishimura
//
//  �@�\�F�s���v��}�X�^(������j)�o�^��ʐ��䓙���s��
//-------------------------------------------------------------------
// �ǉ��{�^���������ɉ�ʗv�f��ǉ�����B
onload = init;
onunload = dbClose;
var ItemField = {
    //div�v�f�̒��ōő��itemNO���擾����currentNumber�ɃZ�b�g����B
    currentNumber: 0,
    itemTemplate: '�s���v��ID�@:<input type="text" name="txtActionPlanCd__count__" id="txtActionPlanCd__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="" \/>' + '�s���v����e:<input type="text" name="txtActionPlan__count__" id="txtActionPlan__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="" \/>' + '�⑫�����@�@:<input type="text" name="txtActionPlanMemo__count__" id="txtActionPlanMemo__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="" \/>' + '<input type="button" name="btnInsert__count__" id="btnInsert__count__" value="�o�^" onclick="dataInsert(txtActionPlanCd__count__.value,txtActionPlan__count__.value,txtActionPlanMemo__count__.value,__count__)" \/>' + '<input type="button" name="btnUpdate__count__" id="btnUpdate__count__" value="�X�V" onclick="dataUpdate(txtActionPlanCd__count__.value,txtActionPlan__count__.value,txtActionPlanMemo__count__.value,__count__)" \/>' + '<input type="button" name="btnDelete__count__" id="btnDelete__count__" value="�폜" onclick="dataDelete(txtActionPlanCd__count__.value,__count__)" \/>',
    add: function() {
        //�e�L�X�g�{�b�N�X�̍Ō�̗v�f�ԍ��擾
        var eleNumber = document.getElementsByTagName("div").length - 1;
        this.currentNumber = eleNumber;
        //�e�L�X�g�t�B�[���h�ǉ�
        this.currentNumber++;
        var field = document.getElementById('item' + this.currentNumber);
        var newItem = this.itemTemplate.replace(/__count__/mg, this.currentNumber);
        field.innerHTML = newItem;
        var nextNumber = this.currentNumber + 1;
        var new_area = document.createElement("div");
        new_area.setAttribute("id", "item" + nextNumber);
        field.appendChild(new_area);
        //�e�L�X�g�{�b�N�X�ǉ����ɍs���v��ID�Ƀt�H�[�J�X
        var nxtfield = document.getElementById('txtActionPlanCd' + this.currentNumber);
        //�ŐV�e�L�X�g�{�b�N�X�Ƀe�L�X�g�{�b�N�X�ɕ\������Ă���ID+1�̒l��\������B
        nxtfield.value = this.currentNumber;
        nxtfield.focus();
    },
    remove: function() {
        var chkCdTxtbox = document.getElementById('txtActionPlanCd' + this.currentNumber);
        var chkDeTxtbox = document.getElementById('txtActionPlan' + this.currentNumber);
        if (this.currentNumber == 0) {
            return;
        }
        //���̓f�[�^���ݎ��̓e�L�X�g�{�b�N�X�폜�s��
        if (chkCdTxtbox.value == "" && chkDeTxtbox.value == '') {
            //�e�L�X�g�t�B�[���h�폜
            var field = document.getElementById('item' + this.currentNumber);
            field.removeChild(field.lastChild);
            field.innerHTML = '';
            this.currentNumber--;
            //�e�L�X�g�{�b�N�X�폜���ɍs���v��ID�Ƀt�H�[�J�X
            var beforefield = document.getElementById('txtActionPlanCd' + this.currentNumber);
            if (this.currentNumber == 0) {
                return;
            } //�ŏI�s���O
            beforefield.focus();
        } else {
            alert("���̓f�[�^�����݂��܂�");
            var currentfield = document.getElementById('txtActionPlanCd' + this.currentNumber);
            currentfield.focus();
        }
    },
    clear: function() {
        var clNumber = document.getElementsByTagName("div").length - 1;
        this.currentNumber = clNumber;
        var clfield = document.getElementById('item' + this.currentNumber);
        clfield.removeChild(clfield.lastChild);
        clfield.innerHTML = '';
        this.currentNumber--;
        var clfield = document.getElementById('item' + this.currentNumber);
        if (this.currentNumber == 0) {
            return;
        } //�ŏI�s���O
        clfield.removeChild(clfield.lastChild);
    }
}

function init() {
    //�����ݒ������֐�
    resizeTo(1000, 640);
    document.getElementById("linkLogOut").onclick = function() {
        OperateEnd();
    }
    document.getElementById("AdminReload").onclick = function() {
        AdministrationCdDisplay();
    }
    dbConnect(); //�f�[�^�x�[�X�ڑ�
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //�o�^�p�����擾
    OperateDate = dateFormat.format(new Date());
    // �f�[�^�x�[�X���烌�R�[�h�����擾���K�v�Ȑ��ʂ̃e�L�X�g�{�b�N�X��\�����Ēl��\������
    AdministrationCdDisplay();
    defaultselect();
    dataDisplay();
    ItemField.add();
}

function OperateEnd() {
    //�I������
    dbClose();
    (window.open('', '_self').opener = window).close();
}
//*****************************************************************************
//
// �f�[�^����֘A
//
//******************************************************************************

function dataCount() {
    //���̍s���v�挏���J�E���g
    var mySql = "SELECT COUNT (ActionPlanID) AS IDCount FROM m_ActionPlan WHERE DeleteFlg Is Null AND AdministrationID = '" + selectAdministration.value + "'";
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
    return idcount;
}

function dataDisplay() {
    try {
        //�f�[�^��\������֐�
        var mySql = "SELECT * FROM m_ActionPlan WHERE ( DeleteFlg Is Null) AND (AdministrationId = '" + selectAdministration.value + "') ORDER BY ActionPlanID";
        var recordSet = database.Execute(mySql);
        var counter = 1;
        var tempHtml = "";
        while (!recordSet.EOF) {
            tempHtml = '�s���v��ID�@:<input type="text" name="txtActionPlanCd' + counter + '" id="txtActionPlanCd' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(1) + '" \/>' + '�s���v����e:<input type="text" name="txtActionPlan' + counter + '" id="txtActionPlan' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="' + recordSet(2) + '" \/>' + '�⑫�����@�@:<input type="text" name="txtActionPlanMemo' + counter + '" id="txtActionPlanMemo' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="' + recordSet(3) + '" \/>' + '<input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="�o�^" onclick="dataInsert(txtActionPlanCd' + counter + '.value,txtActionPlan' + counter + '.value,txtActionPlanMemo' + counter + '.value,' + counter + ')" \/>' + '<input type="button" name="btnUpdate' + counter + '" id="btnUpdate' + counter + '" value="�X�V" onclick="dataUpdate(txtActionPlanCd' + counter + '.value,txtActionPlan' + counter + '.value,txtActionPlanMemo' + counter + '.value,' + counter + ')" \/>' + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="�폜" onclick="dataDelete(txtActionPlanCd' + counter + '.value,' + counter + ')" \/>';
            var field = document.getElementById('item' + counter);
            var newItem = tempHtml;
            field.innerHTML = newItem;
            var nextNumber = counter + 1;
            var new_area = document.createElement("div");
            new_area.setAttribute("id", "item" + nextNumber);
            field.appendChild(new_area);
            recordSet.MoveNext();
            counter++;
        }
        recordSet.Close();
        recordSet = null;
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataInsert(ActionPlanCd, ActionPlan, ActionPlanMemo, txtCount) {
    //  //�f�[�^��ǉ�����֐�
    try {
        var Chkcount = txtCount;
        if (dataCheck(ActionPlanCd, 0, Chkcount) && dataCheck(ActionPlan, 1, Chkcount)) {
            var mySql = "INSERT INTO m_ActionPlan ( ActionPlanID ,ActionPlan ,ActionPlanMemo , Creationdate , AdministrationId ) VALUES(" + "'" + ActionPlanCd + "','" + ActionPlan + "','" + ActionPlanMemo + "','" + OperateDate + "','" + selectAdministration.value + " ');"
            //      alert(mySql);
            database.Execute(mySql);
            alert("�ǉ����܂����B");
            ItemField.add();
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataUpdate(ActionPlanCd, ActionPlan, ActionPlanMemo, txtCount) {
    //�f�[�^���X�V����֐�
    try {
        var Chkcount = txtCount;
        if (dataCheck(ActionPlanCd, 0, Chkcount) && dataCheck(ActionPlan, 1, Chkcount)) {
            var mySql = "UPDATE m_ActionPlan SET ActionPlan ='" + ActionPlan + "', ActionPlanMemo = '" + ActionPlanMemo + "', UpdateDate = '" + OperateDate + "' WHERE ( ActionPlanID = '" + ActionPlanCd + "' ) AND ( AdministrationId = '" + selectAdministration.value + "' );"
            //      console.log(mySql);
            database.Execute(mySql);
            dataDisplay();
            alert("�X�V���܂����B");
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataDelete(ActionPlanCd, txtCount) {
    //�f�[�^���폜����֐�
    try {
        var Chkcount = txtCount;
        if (dataCheck(ActionPlanCd, 0, Chkcount)) {
            var mySql = " UPDATE m_ActionPlan SET DeleteFlg = '1', DeleteDate = '" + OperateDate + "' WHERE ActionPlanID = '" + ActionPlanCd + "' AND AdministrationId = '" + selectAdministration.value + "'";
            //      console.log(mySql);
            database.Execute(mySql);
            alert("�폜���܂����B");
            ItemField.clear()
            dataDisplay();
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function AdministrationCdDisplay() {
    //�s���v��ID���Z���N�g�{�b�N�X�ɕ\�����s���v������x���ɕ\������֐�
    var mySql = "SELECT m_Administration.AdministrationID, m_Administration.AdministrationDetail, m_Administration.Businessyear, m_Administration.DeleteFlg, m_Businessyear.ShowFlg " + "FROM m_Administration INNER JOIN m_Businessyear ON m_Administration.Businessyear = m_Businessyear.BusinessYear " + "WHERE (((m_Administration.DeleteFlg) Is Null) AND ((m_Businessyear.ShowFlg) ='0' )) ORDER BY m_Administration.AdministrationID ;";
    var recordSet = database.Execute(mySql);
    document.getElementById("AdministrationCdDisplay").innerHTML = "";
    var tempHtml = "��{���j�F�@<select name=\"selectAdministration\" id=\"selectAdministration\">\n";
    tempHtml = tempHtml + "\t<option value=\"0\">�I�����Ă��������B</option>\n";
    while (!recordSet.EOF) {
        tempHtml = tempHtml + "\t<option value=\"" + recordSet(0) + "\">" + recordSet(0) + "�F" + recordSet(1) + "</option>\n";
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + "</select>";
    //	console.log(tempHtml);
    document.getElementById("AdministrationCdDisplay").innerHTML = tempHtml;
    selectAdministration = document.getElementById("selectAdministration");
    selectAdministration.onchange = function() {
        AdministrationCdchange(this);
    }
    recordSet.Close();
    recordSet = null;
}

function AdministrationCdchange(obj) {
    //�Z���N�g�{�b�N�X�X�V���̉�ʐ���
    if (obj.selectedIndex == 0) {
        var seladmin = document.getElementById("selectAdministration");
        alert("��{���j��I�����Ă��������B");
        seladmin.focus();
        return;
    }
    var counter = dataCount();
    if (counter == 0) {
        //0���̏ꍇ�͉�ʂ��N���A����B
        var clfield = document.getElementById('item1');
        clfield.removeChild(clfield.lastChild);
        clfield.innerHTML = '';
        dataDisplay();
        ItemField.add();
    } else {
        dataDisplay();
    }
}

function defaultselect() {
    //�Z���N�g�{�b�N�X�Ƀf�t�H���g�l���Z�b�g����B
    var selcounter = document.getElementsByTagName("option").length - 1
    var selyearop = document.getElementById("selectAdministration");
    selyearop.options[selcounter].selected = true;
}
//*****************************************************************************
//
// �G���[�`�F�b�N�֘A
//
//******************************************************************************

function dataCheck(CheckValue, Chckflg, Chkcount) {
    //�f�[�^���`�F�b�N����֐�
    var focucCnt = Chkcount;
    var tempStr = "�͕K�����͂��Ă��������B";
    var txtCd = document.getElementById('txtActionPlanCd' + Chkcount);
    var txtDetail = document.getElementById('txtActionPlan' + Chkcount);
    if (Chckflg == 0 && CheckValue == "") {
        alert("�s���v��ID" + tempStr);
        txtCd.focus();
        return false;
    }
    if (Chckflg == 1 && CheckValue == "") {
        alert("�s���v����e" + tempStr);
        txtDetail.focus();
        return false;
    }
    return true;
}