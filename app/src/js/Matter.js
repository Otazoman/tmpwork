//-------------------------------------------------------------------
// �Č��o�^�p���W���[��
//  2013/5/30  Ver1.0    Created By M.Nishimura
//
//  �@�\�F�Č��}�X�^(�s���v��ɉ������Č�)�o�^��ʐ��䓙���s��
//-------------------------------------------------------------------
// �ǉ��{�^���������ɉ�ʗv�f��ǉ�����B
onload = init;
onunload = dbClose;
var ItemField = {
    //div�v�f�̒��ōő��itemNO���擾����currentNumber�ɃZ�b�g����B
    currentNumber: 0,
    itemTemplate: '�Č�ID�@:<input type="text" name="txtMatterCd__count__" id="txtMatterCd__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="" \/>' + '�Č��@�@:<input type="text" name="txtMatter__count__" id="txtMatter__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="" \/>' + '�T�v�@�@:<textarea name="txtMatterMemo__count__" id="txtMatterMemo__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"><\/textarea>' + '<input type="button" name="btnInsert__count__" id="btnInsert__count__" value="�o�^" onclick="dataInsert(txtMatterCd__count__.value,txtMatter__count__.value,txtMatterMemo__count__.value,__count__)" \/>' + '<input type="button" name="btnUpdate__count__" id="btnUpdate__count__" value="�X�V" onclick="dataUpdate(txtMatterCd__count__.value,txtMatter__count__.value,txtMatterMemo__count__.value,__count__)" \/>' + '<input type="button" name="btnDelete__count__" id="btnDelete__count__" value="�폜" onclick="dataDelete(txtMatterCd__count__.value,__count__)" \/>',
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
        //�e�L�X�g�{�b�N�X�ǉ����ɈČ�ID�Ƀt�H�[�J�X
        var nxtfield = document.getElementById('txtMatterCd' + this.currentNumber);
        //�ŐV�e�L�X�g�{�b�N�X�Ƀe�L�X�g�{�b�N�X�ɕ\������Ă���ID+1�̒l��\������B
        nxtfield.value = this.currentNumber;
        //�Č��Z���N�g�{�b�N�X�Ƀt�H�[�J�X�ړ�

        nxtfield.focus();
    },
    remove: function() {
        var chkCdTxtbox = document.getElementById('txtMatterCd' + this.currentNumber);
        var chkDeTxtbox = document.getElementById('txtMatter' + this.currentNumber);
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
            //�e�L�X�g�{�b�N�X�폜���ɈČ�ID�Ƀt�H�[�J�X
            var beforefield = document.getElementById('txtMatterCd' + this.currentNumber);
            if (this.currentNumber == 0) {
                return;
            } //�ŏI�s���O
            beforefield.focus();
        } else {
            alert("���̓f�[�^�����݂��܂�");
            var currentfield = document.getElementById('txtMatterCd' + this.currentNumber);
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
    document.getElementById("ActionPlanReload").onclick = function() {
        ActionPlanCdDisplay();
    }
    document.getElementById("MakeFolder").onclick = function () {
        MatterFolderMake();
    }
    dbConnect(); //�f�[�^�x�[�X�ڑ�
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //�o�^�p�����擾
    OperateDate = dateFormat.format(new Date());
    // �f�[�^�x�[�X���烌�R�[�h�����擾���K�v�Ȑ��ʂ̃e�L�X�g�{�b�N�X��\�����Ēl��\������
    ActionPlanCdDisplay();
    defaultselect();
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
function dataCount(AdministrationID, ActionPlanID) {
    //�s���v��ɕR�t���Č������J�E���g
    var AdminID = AdministrationID;
    var ActionID = ActionPlanID;
    var mySql = " SELECT Count(m_Matter.MatterID) AS MatterCount "
                 + " FROM (m_Businessyear INNER JOIN (m_Matter INNER JOIN m_Administration ON m_Matter.AdministrationID = m_Administration.AdministrationID)"
                 + " ON m_Businessyear.BusinessYear = m_Administration.Businessyear) INNER JOIN m_ActionPlan"
                 + " ON (m_Matter.ActionplanID = m_ActionPlan.ActionplanID)" + " AND (m_Administration.AdministrationID = m_ActionPlan.AdministrationID)"
                 + " WHERE (((m_Matter.AdministrationID)='" + AdminID + "')" + " AND ((m_Matter.ActionplanID)='" + ActionID + "')" + " AND (m_Businessyear.ShowFlg='0') AND ((m_Administration.DeleteFlg) Is Null)"
                 + " AND ((m_ActionPlan.DeleteFlg) Is Null) AND ((m_Matter.DeleteFlg) Is Null));";
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
    return idcount;
}

function dataDisplay(AdministrationID, ActionPlanID) {
    try {
        //�f�[�^��\������֐�
        var AdminID = AdministrationID;
        var ActionID = ActionPlanID;
        var mySql = " SELECT m_Matter.AdministrationID, m_Matter.ActionplanID, m_Matter.MatterID, m_Matter.MatterName , m_Matter.MatterMemo"
                     + " FROM (m_Businessyear INNER JOIN (m_Matter INNER JOIN m_Administration ON m_Matter.AdministrationID = m_Administration.AdministrationID) "
                     + " ON m_Businessyear.BusinessYear = m_Administration.Businessyear) "
                     + " INNER JOIN m_ActionPlan ON (m_ActionPlan.AdministrationID = m_Administration.AdministrationID) " + " AND (m_Matter.ActionplanID = m_ActionPlan.ActionplanID) "
                     + " WHERE (((m_Matter.AdministrationID)='" + AdminID + "')  AND " + " ((m_Matter.ActionplanID)='" + ActionID + "') AND "
                     + " (m_Businessyear.ShowFlg='0') AND ((m_Administration.DeleteFlg) Is Null) "
                     + " AND ((m_ActionPlan.DeleteFlg) Is Null) AND ((m_Matter.DeleteFlg) Is Null));";
        var recordSet = database.Execute(mySql);
        var counter = 1;
        var tempHtml = "";
        while (!recordSet.EOF) {
            tempHtml = '�Č�ID�@:<input type="text" name="txtMatterCd' + counter + '" id="txtMatterCd' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(2) + '" \/>' + '�Č��@�@:<input type="text" name="txtMatter' + counter + '" id="txtMatter' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="' + recordSet(3) + '" \/>' + '�T�v�@�@:<textarea name="txtMatterMemo' + counter + '" id="txtMatterMemo' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">' + recordSet(4) + '<\/textarea>' + '<input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="�o�^" onclick="dataInsert(txtMatterCd' + counter + '.value,txtMatter' + counter + '.value,txtMatterMemo' + counter + '.value,' + counter + ')" \/>' + '<input type="button" name="btnUpdate' + counter + '" id="btnUpdate' + counter + '" value="�X�V" onclick="dataUpdate(txtMatterCd' + counter + '.value,txtMatter' + counter + '.value,txtMatterMemo' + counter + '.value,' + counter + ')" \/>' + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="�폜" onclick="dataDelete(txtMatterCd' + counter + '.value,' + counter + ')" \/>';
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

function dataInsert(MatterCd, Matter, MatterMemo, txtCount) {
    //�f�[�^��ǉ�����֐�
    var ADcdfield = document.getElementById('AdministrationCd').innerText;
    var workCd = document.getElementById('selectActionPlan').value;
    var ACcdfield = StringSeparator(workCd);
    try {
        var Chkcount = txtCount;
        if (dataCheck(MatterCd, 0, Chkcount) && dataCheck(Matter, 1, Chkcount)) {
            var mySql = " INSERT INTO m_Matter ( AdministrationID, ActionplanID, MatterID ,MatterName , MatterMemo , Creationdate ) VALUES "
                         + "('" + ADcdfield + "','" + ACcdfield + "','" + MatterCd + "','" + Matter + "','" + MatterMemo + "','" + OperateDate + "');";
            //      console.log(mySql);
            database.Execute(mySql);
            alert("�ǉ����܂����B");
            dataDisplay(ADcdfield, ACcdfield);
            ItemField.add();
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataUpdate(MatterCd, Matter, MatterMemo, txtCount) {
    //�f�[�^���X�V����֐�
    var ADcdfield = document.getElementById('AdministrationCd').innerText;
    var workCd = document.getElementById('selectActionPlan').value;
    var ACcdfield = StringSeparator(workCd);
    try {
        var Chkcount = txtCount;
        if (dataCheck(MatterCd, 0, Chkcount) && dataCheck(Matter, 1, Chkcount)) {
            var mySql = " UPDATE m_Matter SET MatterID ='" + MatterCd + "', MatterName = '" + Matter + "', MatterMemo = '" + MatterMemo + "', UpdateDate = '" + OperateDate + "'" + " WHERE ( MatterID = '" + MatterCd + "' ) AND ( ActionPlanId = '" + ACcdfield + "' )  AND ( AdministrationID = '" + ADcdfield + "' );";
            //      console.log(mySql);
            database.Execute(mySql);
            alert("�X�V���܂����B");
            dataDisplay(ADcdfield, ACcdfield);
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataDelete(MatterCd, txtCount) {
    //�f�[�^���폜����֐�
    var ADcdfield = document.getElementById('AdministrationCd').innerText;
    var workCd = document.getElementById('selectActionPlan').value;
    var ACcdfield = StringSeparator(workCd);
    try {
        var Chkcount = txtCount;
        if (dataCheck(MatterCd, 0, Chkcount)) {
            var mySql = " UPDATE m_Matter SET DeleteFlg = '1', DeleteDate = '" + OperateDate + "' WHERE ( MatterID = '" + MatterCd + "' ) AND ( ActionPlanId = '" + ACcdfield + "' )  AND ( AdministrationID = '" + ADcdfield + "' );";
            //      console.log(mySql);
            database.Execute(mySql);
            alert("�폜���܂����B");
            ItemField.clear()
            dataDisplay(ADcdfield, ACcdfield);
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function ActionPlanCdDisplay() {
    //�s���v��ID���Z���N�g�{�b�N�X�ɕ\������֐�
    var mySql = "SELECT m_ActionPlan.AdministrationID, m_ActionPlan.ActionplanID, m_ActionPlan.ActionPlan "
                 + " FROM (m_ActionPlan INNER JOIN m_Administration ON " + " m_ActionPlan.AdministrationID = m_Administration.AdministrationID) "
                 + " INNER JOIN m_Businessyear ON " + " m_Administration.Businessyear = m_Businessyear.BusinessYear "
                 + " WHERE ((m_ActionPlan.DeleteFlg) Is Null) AND (m_Businessyear.ShowFlg='0')  ORDER BY m_ActionPlan.AdministrationID,m_ActionPlan.ActionplanID ;";
    var recordSet = database.Execute(mySql);
    document.getElementById("ActionPlanCdDisplay").innerHTML = "";
    var tempHtml = "�s���v��F�@<select name=\"selectActionPlan\" id=\"selectActionPlan\">\n";
    tempHtml = tempHtml + "\t<option value=\"0\">�I�����Ă��������B</option>\n";
    while (!recordSet.EOF) {
        tempHtml = tempHtml + "\t<option value=\"" + recordSet(0) + "-" + recordSet(1) + "\">" + recordSet(0) + "-" + recordSet(1) + "�F" + recordSet(2) + "</option>\n";
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + "</select>";
    //	console.log(tempHtml);
    document.getElementById("ActionPlanCdDisplay").innerHTML = tempHtml;
    selectActionPlan = document.getElementById("selectActionPlan");
    selectActionPlan.onchange = function() {
        ActionPlanCdchange(this);
    }
    recordSet.Close();
    recordSet = null;
}

function ActionPlanCdchange(obj) {
    //�Z���N�g�{�b�N�X�X�V���̉�ʐ���
    //��{���jCD�ƍs���v��CD�𕪊�����B
    //�Q�ƌ��@https://developer.mozilla.org/ja/docs/JavaScript/Reference/Global_Objects/String/split
    //
    var workCd = obj.value;
    var separator = "-";
    var allayworkCd = workCd.split(separator);
    if (obj.selectedIndex == 0) {
        var seladmin = document.getElementById("selectActionPlan");
        alert("�s���v���I�����Ă��������B");
        seladmin.focus();
        return;
    }
    var AdministrationCd = allayworkCd[0];
    var ActionPlanCd = allayworkCd[1];
    var mySql = " SELECT m_ActionPlan.AdministrationID, m_Administration.AdministrationDetail, m_ActionPlan.ActionplanID, m_ActionPlan.ActionPlan "
                + " FROM (m_ActionPlan INNER JOIN m_Administration ON " + " m_ActionPlan.AdministrationID = m_Administration.AdministrationID) "
                + " INNER JOIN m_Businessyear ON " + " m_Administration.Businessyear = m_Businessyear.BusinessYear "
                + " WHERE ((m_ActionPlan.[AdministrationID])='" + AdministrationCd + "') "
                + " AND ((m_ActionPlan.[ActionplanID])='" + ActionPlanCd + "') AND ((m_ActionPlan.[DeleteFlg]) Is Null) "
                + " AND (m_Businessyear.ShowFlg='0');"
    var recordSet = database.Execute(mySql);
    var sk1 = recordSet(0); //��{���jID
    var sk2 = recordSet(2); //�s���v��ID
    document.getElementById("AdministrationCdDisplay").innerHTML = "";
    var tempHtml = "��{���j�F�@<span id=\"AdministrationCd\">" + recordSet(0) + "</span>" + "<span id=\"Administration\">" + recordSet(1) + "</span>";
    document.getElementById("AdministrationCdDisplay").innerHTML = tempHtml;
    var counter = dataCount(sk1, sk2);
    if (counter == 0) {
        //0���̏ꍇ�͉�ʂ��N���A����B
        var clfield = document.getElementById('item1');
        //�q�I�u�W�F�N�g���擾�\�ȏꍇ�͎q�c���[���폜���ăe�L�X�g�{�b�N�X�ǉ�
        if (clfield.lastchild) {
            ItemField.clear()
            clfield.removeChild(clfield.lastChild);
            clfield.innerHTML = '';
            ItemField.add();
        }
        //�q�I�u�W�F�N�g�擾�s�̏ꍇ�͎q�I�u�W�F�N�g�𖳎����ăe�L�X�g�{�b�N�X�ǉ�
        clfield.innerHTML = '';
        ItemField.add();
    } else {
        dataDisplay(sk1, sk2);
        ItemField.add();
    }
    recordSet.Close();
    recordSet = null;
}

function defaultselect() {
//�Z���N�g�{�b�N�X�Ƀf�t�H���g�l���Z�b�g����B
    var selcounter = document.getElementsByTagName("option").length - 1
    var selyearop = document.getElementById("selectActionPlan");
    selyearop.options[selcounter].selected = true;
    ActionPlanCdchange(selyearop.options[selcounter]);
}
//*****************************************************************************
//
// �t�H���_�쐬�֘A
//
//******************************************************************************
function MatterFolderMake() {
    var myObject = new ActiveXObject("Scripting.FileSystemObject");
    //���[�J�����ؗp
    //var fpath = "C:\\Users\\nishimuram\\Desktop\\�V�����t�H���_�[\\";
    //�t�@�C���T�[�o�ł̍쐬�p
    var fpath = "\\\\fs2010\\29_���V�X�e��(��p�j\\90_�ꎞ�g�p\\99_�Č��t�H���_�쐬�p\\";
    try {
        //���R�[�h�����J�E���g
        var mySql =" SELECT Count(m_Matter.MatterID) AS MaCount"
                    + " FROM m_Businessyear INNER JOIN (m_ActionPlan INNER JOIN (m_Matter INNER JOIN m_Administration ON m_Matter.AdministrationID = m_Administration.AdministrationID)"
                    + " ON (m_ActionPlan.AdministrationID = m_Administration.AdministrationID) AND (m_ActionPlan.ActionplanID = m_Matter.ActionplanID))"
                    + " ON m_Businessyear.BusinessYear = m_Administration.Businessyear"
                    + " WHERE (((m_Businessyear.ShowFlg)='0') AND ((m_Administration.DeleteFlg) Is Null) AND ((m_ActionPlan.DeleteFlg) Is Null) "
                    + " AND ((m_Matter.DeleteFlg) Is Null));";
        var crecordSet = database.Execute(mySql);
        var ReportCount = crecordSet(0);
        //���R�[�h���ݎ��̂ݏ���
        if (ReportCount != 0) {
            var mySql = "SELECT m_Businessyear.BusinessYear, m_Matter.AdministrationID, m_Matter.ActionplanID, m_Matter.MatterID, m_Matter.MatterName "
                        + " FROM m_Businessyear INNER JOIN (m_ActionPlan INNER JOIN (m_Matter INNER JOIN m_Administration ON "
                        + " m_Matter.AdministrationID = m_Administration.AdministrationID) ON (m_ActionPlan.AdministrationID = m_Administration.AdministrationID) "
                        + " AND (m_ActionPlan.ActionplanID = m_Matter.ActionplanID)) ON m_Businessyear.BusinessYear = m_Administration.Businessyear "
                        + " WHERE (((m_Businessyear.ShowFlg)='0') AND ((m_Administration.DeleteFlg) Is Null) AND ((m_ActionPlan.DeleteFlg) Is Null) "
                        + " AND ((m_Matter.DeleteFlg) Is Null));";
            var recordSet = database.Execute(mySql);
            //alert(mySql);
            //console.log(mySql);
            while (!recordSet.EOF) {
                //�t�H���_������
                var foldername = Number(recordSet(1)) + '-' + Number(recordSet(2)) + '-' + Number(recordSet(3)) + '_' + recordSet(4);
                //�t�H���_�쐬
                var makefoldername = String(fpath + foldername);
                var newfolder = myObject.CreateFolder(makefoldername);
                recordSet.MoveNext();
            }
            recordSet.Close();
            recordSet = null;
        }
        crecordSet.Close();
        crecordSet = null;
        alert("�u" + fpath + "�v�Ƀt�H���_���쐬���܂����B" );
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
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
    var txtCd = document.getElementById('txtMatterCd' + Chkcount);
    var txtDetail = document.getElementById('txtMatter' + Chkcount);
    if (Chckflg == 0 && CheckValue == "") {
        alert("�Č�ID" + tempStr);
        txtCd.focus();
        return false;
    }
    if (Chckflg == 1 && CheckValue == "") {
        alert("�Č����e" + tempStr);
        txtDetail.focus();
        return false;
    }
    return true;
}

function StringSeparator(objString) {
//�s���v��ID���擾����B(������Z�p���[�g)
    var sobj = objString;
    var separator = "-";
    var allayworkCd = sobj.split(separator);
    var robj = allayworkCd[1];
    return robj;
}