//-------------------------------------------------------------------
// ��{���j�o�^�p���W���[��
//  2013/5/24  Ver1.0    Created By M.Nishimura
//
//  �@�\�F��{���j�}�X�^(�S�Е��j)�o�^��ʐ��䓙���s��
//-------------------------------------------------------------------
// �ǉ��{�^���������ɉ�ʗv�f��ǉ�����B
// 
// �Q�ƌ��Fhttp://vkgtaro.jp/2007/10/28/000618
//	   http://www.abe-tatsuya.com/web_prog/javascript/add_table_rows.php
//	   http://www.cozzbox.com/wordpress/archives/545
//
onload = init;
onunload = dbClose;
var ItemField = {
    //div�v�f�̒��ōő��itemNO���擾����currentNumber�ɃZ�b�g����B
    //�Q�ƌ��F�@http://d.hatena.ne.jp/MAXIMUM-PRO/20101013/1286960457
    //		http://wildcat.cocolog-nifty.com/web/2006/06/javascript_af76.html
    //		
    currentNumber: 0,
    itemTemplate: '��{���jID�@:<input type="text" name="txtAdministrationCd__count__" id="txtAdministrationCd__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="" \/>' + '��{���j���e:<input type="text" name="txtAdministrationDetail__count__" id="txtAdministrationDetail__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="" \/>' + '�⑫�����@�@:<input type="text" name="txtAdministrationMemo__count__" id="txtAdministrationMemo__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="" \/>' + '<input type="button" name="btnInsert__count__" id="btnInsert__count__" value="�o�^" onclick="dataInsert(txtAdministrationCd__count__.value,txtAdministrationDetail__count__.value,txtAdministrationMemo__count__.value,__count__)" \/>' + '<input type="button" name="btnUpdate__count__" id="btnUpdate__count__" value="�X�V" onclick="dataUpdate(txtAdministrationCd__count__.value,txtAdministrationDetail__count__.value,txtAdministrationMemo__count__.value,__count__)" \/>' + '<input type="button" name="btnDelete__count__" id="btnDelete__count__" value="�폜" onclick="dataDelete(txtAdministrationCd__count__.value,__count__)" \/>',
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
        //�e�L�X�g�{�b�N�X�ǉ����Ɋ�{���jID�Ƀt�H�[�J�X
        var nxtfield = document.getElementById('txtAdministrationCd' + this.currentNumber);
        //�ŐV�e�L�X�g�{�b�N�X�Ƀe�L�X�g�{�b�N�X�ɕ\������Ă���ID+1�̒l��\������B
        nxtfield.value = this.currentNumber;
        nxtfield.focus();
    },
    remove: function() {
        var chkCdTxtbox = document.getElementById('txtAdministrationCd' + this.currentNumber);
        var chkDeTxtbox = document.getElementById('txtAdministrationDetail' + this.currentNumber);
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
            //�e�L�X�g�{�b�N�X�폜���Ɋ�{���jID�Ƀt�H�[�J�X
            var beforefield = document.getElementById('txtAdministrationCd' + this.currentNumber);
            if (this.currentNumber == 0) {
                return;
            } //�ŏI�s���O
            beforefield.focus();
        } else {
            alert("���̓f�[�^�����݂��܂�");
            var currentfield = document.getElementById('txtAdministrationCd' + this.currentNumber);
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
    dbConnect(); //�f�[�^�x�[�X�ڑ�
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //�o�^�p�����擾
    OperateDate = dateFormat.format(new Date());
    // �f�[�^�x�[�X���烌�R�[�h�����擾���K�v�Ȑ��ʂ̃e�L�X�g�{�b�N�X��\�����Ēl��\������
    businessyearDisplay()
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
    //���̊�{���j�����J�E���g
    var mySql = "SELECT COUNT (AdministrationID) AS IDCount FROM m_Administration WHERE DeleteFlg Is Null AND Businessyear = " + Number(selectYear.value);
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
    return idcount;
}

function dataDisplay() {
    try {
        //�f�[�^��\������֐�
        var mySql = "SELECT * FROM m_Administration WHERE ( DeleteFlg Is Null) AND Businessyear = " + Number(selectYear.value) + " ORDER BY AdministrationID";
        var recordSet = database.Execute(mySql);
        var counter = 1;
        var tempHtml = "";
        while (!recordSet.EOF) {
            tempHtml = '��{���jID�@:<input type="text" name="txtAdministrationCd' + counter + '" id="txtAdministrationCd' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(0) + '" \/>' + '��{���j���e:<input type="text" name="txtAdministrationDetail' + counter + '" id="txtAdministrationDetail' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="' + recordSet(1) + '" \/>' + '�⑫�����@�@:<input type="text" name="txtAdministrationMemo' + counter + '" id="txtAdministrationMemo' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="' + recordSet(2) + '" \/>' + '<input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="�o�^" onclick="dataInsert(txtAdministrationCd' + counter + '.value,txtAdministrationDetail' + counter + '.value,txtAdministrationMemo' + counter + '.value,' + counter + ')" \/>' + '<input type="button" name="btnUpdate' + counter + '" id="btnUpdate' + counter + '" value="�X�V" onclick="dataUpdate(txtAdministrationCd' + counter + '.value,txtAdministrationDetail' + counter + '.value,txtAdministrationMemo' + counter + '.value,' + counter + ')" \/>' + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="�폜" onclick="dataDelete(txtAdministrationCd' + counter + '.value,' + counter + ')" \/>';
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

function dataInsert(AdministrationCd, AdministrationDetail, AdministrationMemo, txtCount) {
    //  //�f�[�^��ǉ�����֐�
    try {
        var Chkcount = txtCount;
        if (dataCheck(AdministrationCd, 0, Chkcount) && dataCheck(AdministrationDetail, 1, Chkcount)) {
            var mySql = "INSERT INTO m_Administration ( AdministrationID ,AdministrationDetail ,AdministrationMemo , Creationdate , Businessyear ) VALUES(" + "'" + AdministrationCd + "','" + AdministrationDetail + "','" + AdministrationMemo + "','" + OperateDate + "'," + Number(selectYear.value) + ");"
            //      alert(mySql);
            database.Execute(mySql);
            alert("�ǉ����܂����B");
            ItemField.add();
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataUpdate(AdministrationCd, AdministrationDetail, AdministrationMemo, txtCount) {
    //�f�[�^���X�V����֐�
    try {
        var Chkcount = txtCount;
        if (dataCheck(AdministrationCd, 0, Chkcount) && dataCheck(AdministrationDetail, 1, Chkcount)) {
            var mySql = "UPDATE m_Administration SET AdministrationDetail ='" + AdministrationDetail + "', AdministrationMemo = '" + AdministrationMemo + "', UpdateDate = '" + OperateDate + "' WHERE AdministrationID = '" + AdministrationCd + "' AND Businessyear = " + Number(selectYear.value) + ";"
            //      alert(mySql);
            database.Execute(mySql);
            dataDisplay();
            alert("�X�V���܂����B");
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataDelete(AdministrationCd, txtCount) {
    //  //�f�[�^���폜����֐�
    try {
        var Chkcount = txtCount;
        if (dataCheck(AdministrationCd, 0, Chkcount)) {
            var mySql = " UPDATE m_Administration SET DeleteFlg = '1', DeleteDate = '" + OperateDate + "' WHERE AdministrationID = '" + AdministrationCd + "' AND Businessyear = " + Number(selectYear.value);
            //      alert(mySql);
            database.Execute(mySql);
            alert("�폜���܂����B");
            ItemField.clear()
            dataDisplay();
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function businessyearDisplay() {
    //�����Z���N�g�{�b�N�X�ɕ\������֐�
    var mySql = "SELECT BusinessYear FROM m_Businessyear WHERE (m_Businessyear.ShowFlg = '0') ORDER BY BusinessYear";
    var recordSet = database.Execute(mySql);
    document.getElementById("businessyearDisplay").innerHTML = "";
    var tempHtml = "���F�@<select name=\"selectyear\" id=\"selectYear\">\n";
    tempHtml = tempHtml + "\t<option value=\"0\">�I�����Ă��������B</option>\n";
    while (!recordSet.EOF) {
        tempHtml = tempHtml + "\t<option value=\"" + recordSet(0) + "\">" + recordSet(0) + "</option>\n";
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + "</select>";
    //	alert(tempHtml);
    document.getElementById("businessyearDisplay").innerHTML = tempHtml;
    selectYear = document.getElementById("selectYear");
    selectYear.onchange = function() {
        businessyearchange(this);
    }
    recordSet.Close();
    recordSet = null;
}

function businessyearchange(obj) {
    //�Z���N�g�{�b�N�X�X�V���̉�ʐ���
    if (obj.selectedIndex == 0) {
        alert("����I�����Ă��������B");
        var selyear = document.getElementById("selectYear");
        selyear.focus();
        return;
    }
    var counter = dataCount();
    if (counter == 0) {
        //		//0���̏ꍇ�͉�ʂ��N���A����B
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
    //  �Q�ƌ��@http://www.artemis.ac/contents/javascript/javascript11.htm
    //          http://www.pori2.net/js/form/5.html
    //
    var selcounter = document.getElementsByTagName("option").length - 1
    var selyearop = document.getElementById("selectYear");
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
    var txtCd = document.getElementById('txtAdministrationCd' + Chkcount);
    var txtDetail = document.getElementById('txtAdministrationDetail' + Chkcount);
    if (Chckflg == 0 && CheckValue == "") {
        alert("��{���jID" + tempStr);
        txtCd.focus();
        return false;
    }
    if (Chckflg == 1 && CheckValue == "") {
        alert("��{���j���e" + tempStr);
        txtDetail.focus();
        return false;
    }
    return true;
}