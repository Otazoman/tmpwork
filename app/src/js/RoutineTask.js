//-------------------------------------------------------------------
// ��^��Ɠo�^�p���W���[��
//  2013/12/XX  Ver1.0    Created By M.Nishimura
//  2017/5/19   Ver1.1    ���t�@�N�^�����O(�Ј��R�[�h�����̊O����)
//
//  �@�\�F��^��Ɠo�^��ʂ̍�ƌv����s��
//-------------------------------------------------------------------

//����o�^��ʂ���p�����[�^�擾
var query = location.search.substring(1);
if (1 < window.location.search.length) {
    // �N�G���̋�؂�L�� (&) �ŕ������z��ɕ�������
    var parameters = query.split('&');
    var result = new Object();
    for (var i = 0; i < 2; i++) {
        // �p�����[�^���ƃp�����[�^�l�ɕ�������
        var element = parameters[i].split('=');
        result[i] = decodeURIComponent(element[1]);
        var Emp = result[0];
        var Cnt = result[1];
    }

}
var EmpCd = Emp;     //�S���҃R�[�h
var TxtCnt = Cnt;     //�e�L�X�g�s��

//������
onload = init;
onunload = dbClose;

//*
//* �ǉ��{�^���������ɓ��͍��ڂ�ǉ�����B
//*

var ItemField = {
    //div�v�f�̒��ōő��itemNO���擾����currentNumber�ɃZ�b�g����B
    currentNumber: 0,
    itemTemplate: '<table style ="width:1048px" border="1" >'
                 + '<tr><td><input type="button" name="btnSelect__count__" id="btnSelect__count__" value="�I��" onclick = "selectRoutine(0,__count__)" \/>'
                 + '��^���ID�@:<input type="text" name="txtPlanCd__count__" id="txtPlanCd__count__"  style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="" \/>'
                 + '�Č�:<span id="MatterCdDisplay__count__"></span>' + '<span id="MatterDisplay__count__"></span>' + '���:<span id="TaskCdDisplay__count__"></span>'
                 + '<span id="TaskDisplay__count__"></span>'
                 + '<br/>��^��Ɠ��e:<textarea name="txtMemo__count__" id="txtMemo__count__" cols="100" rows="2"  onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">��^��Ɠ��e����͂��Ă��������B<\/textarea><\/td>'
                 + '<td><input type="button" name="btnInsert__count__" id="btnInsert__count__" value="�o�^" onclick="btnActionSelect(txtPlanCd__count__.value,txtMemo__count__.value,__count__,0)" \/>'
                 + '<input type="button" name="btnDelete__count__" id="btnDelete__count__" value="�폜" onclick="btnActionSelect(txtPlanCd__count__.value,txtMemo__count__.value,__count__,1)" \/>',
    add: function () {
        //�e�L�X�g�{�b�N�X�̍Ō�̗v�f�ԍ��擾
        var eleNumber = document.getElementsByTagName("div").length - 1;
        this.currentNumber = eleNumber;
        var beforeNumber = eleNumber;
        //�e�L�X�g�t�B�[���h�ǉ�
        this.currentNumber++;
        var field = document.getElementById('item' + this.currentNumber);
        var newItem = this.itemTemplate.replace(/__count__/mg, this.currentNumber);
        field.innerHTML = newItem;
        var nextNumber = this.currentNumber + 1;
        var new_area = document.createElement("div");
        new_area.setAttribute("id", "item" + nextNumber);
        MatterCdDisplay(this.currentNumber, 0);
        TaskCdDisplay(this.currentNumber, "0");
        field.appendChild(new_area);
        //�e�L�X�g�{�b�N�X�ǉ����ɍ�ƌv��ID�Ƀt�H�[�J�X
        var nxtfield = document.getElementById('txtPlanCd' + this.currentNumber);
        //2�Ԗڈȍ~�̍��ڂł͑O�s�̍�ƌv��ID�l���擾����B
        if (beforeNumber != 0) {
            var beforefield = document.getElementById('txtPlanCd' + beforeNumber);
            var befvalue = beforefield.value;
        }
        //�ŐV�e�L�X�g�{�b�N�X�Ƀe�L�X�g�{�b�N�X�ɕ\������Ă���ID+1�̒l��\������B
        //�f�[�^�x�[�X�ɓo�^����Ă���l�ƍŐV�ԍ�������Ă���ꍇ�́A����ID��+1����B
        if (beforeNumber != 0 && befvalue != beforeNumber) {
            var nextNumber = Number(befvalue) + 1;
            nxtfield.value = nextNumber;
        } else {
            nxtfield.value = this.currentNumber;
        }
        //�Č��Z���N�g�{�b�N�X�Ƀt�H�[�J�X�ړ�
        var nxtMatter = document.getElementById('selectMatter' + this.currentNumber);
        nxtMatter.focus();
    },
    //���ڍ폜
    remove: function () {
        var chkPCdTxtbox = document.getElementById('txtPlanCd' + this.currentNumber);
        var chkMCdTxtbox = document.getElementById('txtMemo' + this.currentNumber);
        if (this.currentNumber == 0) {
            return;
        }
        //���̓f�[�^���ݎ��̓e�L�X�g�{�b�N�X�폜�s��
        if (chkPCdTxtbox.value == "" && chkMCdTxtbox.value == '') {
            //�e�L�X�g�t�B�[���h�폜
            var field = document.getElementById('item' + this.currentNumber);
            field.removeChild(field.lastChild);
            field.innerHTML = '';
            this.currentNumber--;
            //�e�L�X�g�{�b�N�X�폜���ɈČ�ID�Ƀt�H�[�J�X
            var beforefield = document.getElementById('txtPlanCd' + this.currentNumber);
            if (this.currentNumber == 0) {
                return;
            } //�ŏI�s���O
            beforefield.focus();
        } else {
            alert("���̓f�[�^�����݂��܂�");
            var currentfield = document.getElementById('txtPlanCd' + this.currentNumber);
            currentfield.focus();
        }
    },
    clear: function () {
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

//*
//* �����ݒ������֐�
//*
function init() {
    //�f�[�^�x�[�X�ڑ�
    dbConnect();
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //�o�^�p�����擾
    OperateDate = dateFormat.format(new Date());
    //�����{�^��
    document.getElementById("btnEmpSearch").onclick = function () {
        EmpIdUpdate();
    }
    // �S���҂��Z�b�g���ĉ�ʂ̏����\��
    EmpCdisplay(EmpCd);
    dataDisplay(EmpCd, TxtCnt);

}

//*
//* �I������
//*
function OperateEnd() {
    dbClose();
    (window.open('', '_self').opener = window).close();
}

//*****************************************************************************
//
// �f�[�^����֘A
//
//******************************************************************************

//*
//*�@�f�[�^�x�[�X�ւ̒ǉ��E�폜�E�X�V���f
//*
function btnActionSelect(RoutineWorkID, Memo, txtCount, selectMode) {
    var sCount = txtCount;        //���ڈʒu�擾�p
    //�S����I�����Ă��Ȃ��ꍇ�̃`�F�b�N
    var selEmp = document.getElementById('selectEmpId');
    if (selEmp.selectedIndex == 0) {
        alert("�S���҂�I�����Ă��������B");
        selEmp.focus();
        return;
    }
    //�Č��ƍ�Ƃ�I�����Ă��Ȃ��ꍇ�̃`�F�b�N
    var selMatter = document.getElementById('selectMatter' + sCount);
    if (selMatter.value == 0) {
        alert("�Č���I�����Ă��������B");
        selMatter.focus();
        return;
    }
    var selTask = document.getElementById('selectTask' + sCount);
    if (selTask.value == 0) {
        alert("��Ƃ�I�����Ă��������B");
        selTask.focus();
        return;
    }
    //�K�v���ڗރZ�b�g
    var wid = RoutineWorkID;
    var RoutineMemo = Memo;
    dataCheck(RoutineWorkID, 0, sCount);
    var EmpID = EmpCd;
    var AdminID = document.getElementById('AdministrationCd' + sCount).innerText;
    var ActionID = document.getElementById('ActionPlanCd' + sCount).innerText;
    var MatterID = document.getElementById('MatterCd' + sCount).innerText;
    var TaskID = document.getElementById('TaskCd' + sCount).innerText;
    //DB�o�^�󋵊m�F
    var mySql = " SELECT Count(RoutineWorkID) AS CountWid "
                + " FROM m_RoutineWork "
                + " WHERE ( RoutineWorkID =" + wid + ") AND ( Empid ='" + EmpID + "');";

    //console.log(mySql);
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
    //�o�^���[�h�ɂ�鏈������
    if (selectMode == 1) {
        //�폜
        dataDelete(wid, EmpID, sCount);
        return;
    }
    if (selectMode == 0 && idcount == 0) {
        //�ǉ�
        dataInsert(wid, RoutineMemo, AdminID, ActionID, MatterID, TaskID, EmpID, sCount);
    } else {
        //�X�V
        dataUpdate(wid, RoutineMemo, AdminID, ActionID, MatterID, TaskID, EmpID, sCount);
    }

}

//*
//* �]�ƈ��R�[�h���X�V�����ۂɉ�ʂ��ĕ`�悷��֐�
//*
function EmpIdUpdate() {
    var EmpID = EmpCd;
    var mySql = " SELECT Count(RoutineWorkID) AS CountWid "
                + " FROM m_RoutineWork "
                + " WHERE ( Empid ='" + EmpID + "') AND (DeleteFlg ='0');";
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
    //    console.log(mySql);
    if (idcount == 0) {
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
        dataDisplay(EmpID, 0);
    }
    recordSet.Close();
    recordSet = null;
}

//*
//* �f�[�^��\������֐�
//*
function dataDisplay(EmpId, tCnt) {
    try {
        varTxtCnt = tCnt
        var mySql = " SELECT RoutineWorkID, AdministrationID, ActionplanID, MatterID, TaskID ,RoutineMemo " + " FROM m_RoutineWork"
                     + " WHERE (Empid='" + EmpId + "') AND (DeleteFlg = '0' ) ORDER BY  RoutineWorkID ;";
        var recordSet = database.Execute(mySql);
        //console.log(mySql);
        var counter = 1;
        var tempHtml = "";
        while (!recordSet.EOF) {
            tempHtml = '<table style ="width:1048px" border="1" >'
                         + '<tr><td><input type="button" name="btnSelect' + counter + '" id="btnSelect' + counter + '" value="�I��" onclick="selectRoutine(' + TxtCnt + ',' + counter + ')" \/>'
                         + '��^���ID�@:<input type="text" name="txtPlanCd' + counter + '" id="txtPlanCd' + counter + '" style ="width:30px"  onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(0) + '" \/>'
                         + '�Č�:<span id="MatterCdDisplay' + counter + '"></span>' + '<span id="MatterDisplay' + counter + '"></span>'
                         + '���:<span id="TaskCdDisplay' + counter + '" ></span>' + '<span id="TaskDisplay' + counter + '"></span>'
                         + '<br/>��^��Ɠ��e:<textarea name="txtMemo' + counter + '" id="txtMemo' + counter + '" cols="100" rows="2"  onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">' + recordSet(5) + ' <\/textarea><\/td>'
                         + '<td><input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="�o�^" onclick="btnActionSelect(txtPlanCd' + counter + '.value,txtMemo' + counter + '.value,' + counter + ',0)" \/>'
                         + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="�폜" onclick="btnActionSelect(txtPlanCd' + counter + '.value,txtMemo' + counter + '.value,' + counter + ',1)" \/><\/td><\/tr></table>';
            var field = document.getElementById('item' + counter);
            var newItem = tempHtml;
            field.innerHTML = newItem;
            var nextNumber = counter + 1;
            var new_area = document.createElement("div");
            new_area.setAttribute("id", "item" + nextNumber);
            field.appendChild(new_area);
            //�Č�ID�\��
            var Mcd = Number(recordSet(1)) + '-' + Number(recordSet(2)) + '-' + Number(recordSet(3));
            MatterCdDisplay(counter, Mcd);
            var mdSelect = document.getElementById('MatterCdDisplay' + counter)
            mdSelect.innerHTML = "";
            var tempHtml = '<span id="AdministrationCd' + counter + '"\">' + recordSet(1) + '<\/span>' + '-' + '<span id=\"ActionPlanCd' + counter + '\">' + recordSet(2) + '<\/span>' + '-' + '<span id="MatterCd' + counter + '"\">' + recordSet(3) + '<\/span>';
            mdSelect.innerHTML = tempHtml;
            //���ID�\���\���p
            var Tcd = recordSet(4);
            TaskCdDisplay(counter, Tcd);
            var mtSelect = document.getElementById('TaskCdDisplay' + counter);
            mtSelect.innerHTML = "";
            var tempHtml = '<span id="TaskCd' + counter + '"\">' + Tcd + '<\/span>';
            mtSelect.innerHTML = tempHtml;
            recordSet.MoveNext();
            counter++;
        }
        recordSet.Close();
        recordSet = null;
        ItemField.add();

    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//* �f�[�^��ǉ�����֐�
//*
function dataInsert(RoutineWorkID, PMemo, AdminID, ActionID, MatterID, TaskID, EmpID, PlanDate, Chkcount) {
    try {
        if (dataCheck(RoutineWorkID, 0, Chkcount) && dataCheck(PMemo, 1, Chkcount)) {
            var nextNum = Chkcount + 2;
            var nextItem = document.getElementById('item' + nextNum);
            var mySql = "INSERT INTO m_RoutineWork (EmpID,AdministrationID,ActionplanID,MatterID,TaskID,RoutineMemo,Creationdate,DeleteFlg ) "
                      + " VALUES ('" + EmpID + "','" + AdminID + "','" + ActionID + "','" + MatterID + "','" + TaskID + "','" + PMemo + "','" + OperateDate + "','0');";
            database.Execute(mySql);
            alert("�ǉ����܂����B");
            //�ŏI�s�̃e�L�X�g�{�b�N�X�Ȃ�s�ǉ�
            if (nextItem) {
                return;
            } else {
                dataDisplay(EmpID);
            }
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//* �f�[�^���X�V����֐�
//*
function dataUpdate(RoutineWorkID, PMemo, AdminID, ActionID, MatterID, TaskID, EmpID, Chkcount) {
    try {
        if (dataCheck(RoutineWorkID, 0, Chkcount) && dataCheck(PMemo, 1, Chkcount)) {
            var mySql = " UPDATE m_RoutineWork SET AdministrationID ='" + AdminID + "', ActionplanID = '" + ActionID + "', MatterID = '" + MatterID + "', TaskID = '" + TaskID + "', RoutineMemo = '" + PMemo + "',"
			            + " DeleteFlg ='0' WHERE ( RoutineWorkID = " + RoutineWorkID + " ) AND ( Empid = '" + EmpID + "' );";
            //console.log(mySql);
            database.Execute(mySql);
            alert("�X�V���܂����B");
            dataDisplay(EmpID);
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//* �f�[�^���폜����֐�
//*
function dataDelete(RoutineWorkID, EmpID, Chkcount) {
    try {
        if (dataCheck(RoutineWorkID, 0, Chkcount)) {
            var mySql = " UPDATE m_RoutineWork SET DeleteFlg ='1', DeleteDate = '" + OperateDate + "'"
			            + " WHERE ( RoutineWorkID = " + RoutineWorkID + " ) AND ( Empid = '" + EmpID + "' );";
            //      console.log(mySql);
            database.Execute(mySql);
            alert("�폜���܂����B");
            ItemField.clear();
            dataDisplay(EmpID);
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//* �Č����Z���N�g�{�b�N�X�ɕ\������֐�
//*
function MatterCdDisplay(Mcounter, MatterCd) {
    var labCounter = Mcounter;
    var mySql = " SELECT m_Administration.AdministrationID, m_ActionPlan.ActionplanID, m_Matter.MatterID, m_Matter.MatterName "
        + " FROM (m_ActionPlan INNER JOIN m_Matter ON m_ActionPlan.ActionplanID = m_Matter.ActionplanID) "
        + " INNER JOIN (m_Administration INNER JOIN m_Businessyear ON m_Administration.Businessyear = m_Businessyear.BusinessYear) "
        + " ON (m_ActionPlan.AdministrationID = m_Administration.AdministrationID) "
        + " AND (m_Matter.AdministrationID = m_Administration.AdministrationID) "
        + " WHERE (m_ActionPlan.DeleteFlg Is Null) AND (m_Businessyear.ShowFlg = '0'); ";
    //alert(mySql);
    var recordSet = database.Execute(mySql);
    var MatterBox = document.getElementById('MatterDisplay' + labCounter);
    MatterBox.innerHTML = "";
    var tempHtml = '<select name="selectMatter' + labCounter + '" id="selectMatter' + labCounter + '" onchange="MatterCdchange(this,' + labCounter + ')" \">\n';
    tempHtml = tempHtml + '\t<option value="0">�I�����Ă��������B<\/option>\n';
    while (!recordSet.EOF) {
        var optionval = Number(recordSet(0)) + '-' + Number(recordSet(1)) + '-' + Number(recordSet(2));
        //�I�v�V�����l�w�肪����ꍇ�͂��̃I�v�V������I����Ԃɂ���B
        if (optionval == MatterCd) {
            tempHtml = tempHtml + '\t<option value="' + optionval + '" selected >' + recordSet(3) + '<\/option>\n';
        } else {
            tempHtml = tempHtml + '\t<option value="' + optionval + '"\">' + recordSet(3) + '<\/option>\n';
        }
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + '</select>';
    MatterBox.innerHTML = tempHtml;
    recordSet.Close();
    recordSet = null;
}

//*
//* �Č��Z���N�g�{�b�N�X�X�V���̉�ʐ���
//*
function MatterCdchange(obj, Mcounter) {
    //��{���jCD�ƍs���v��CD�ƈČ�CD�𕪊�����B�B
    var laMcounter = Mcounter;
    var workCd = obj.value;
    var separator = "-";
    var allayworkCd = workCd.split(separator);
    if (obj.selectedIndex == 0) {
        var selmatter = document.getElementById("selectMatter");
        alert("�Č���I�����Ă��������B");
        obj.focus();
        return;
    }
    var AdministrationCd = allayworkCd[0];
    var ActionPlanCd = allayworkCd[1];
    var MatterCd = allayworkCd[2];
    var mySql = " SELECT m_Matter.AdministrationID, m_Matter.ActionplanID, m_Matter.MatterID"
        + " FROM m_ActionPlan INNER JOIN (m_Matter INNER JOIN (m_Administration INNER JOIN m_Businessyear"
        + " ON m_Administration.Businessyear = m_Businessyear.BusinessYear)"
        + " ON m_Matter.AdministrationID = m_Administration.AdministrationID)"
        + " ON (m_ActionPlan.ActionplanID = m_Matter.ActionplanID)"
        + " AND (m_ActionPlan.AdministrationID = m_Administration.AdministrationID)"
        + " WHERE (m_Matter.AdministrationID ='" + AdministrationCd + "')"
        + " AND ( m_Matter.ActionplanID ='" + ActionPlanCd + "')"
        + " AND (m_Matter.MatterID ='" + MatterCd + "')"
        + " AND (m_ActionPlan.DeleteFlg Is Null)"
        + " AND (m_Businessyear.ShowFlg = '0');"
    var recordSet = database.Execute(mySql);
    var sk1 = recordSet(0); //��{���jID
    var sk2 = recordSet(1); //�s���v��ID
    var sk3 = recordSet(2); //�Č�ID
    var mdSelect = document.getElementById('MatterCdDisplay' + Mcounter)
    mdSelect.innerHTML = "";
    var tempHtml = '<span id="AdministrationCd' + laMcounter + '"\">' + recordSet(0) + '<\/span>' + '-' + '<span id=\"ActionPlanCd' + laMcounter + '\">' + recordSet(1) + '<\/span>' + '-' + '<span id="MatterCd' + laMcounter + '"\">' + recordSet(2) + '<\/span>';
    mdSelect.innerHTML = tempHtml;
}

//*
//* ��Ƃ��Z���N�g�{�b�N�X�ɕ\������֐�
//*
function TaskCdDisplay(Mcounter, TaskCd) {
    var labCounter = Mcounter;
    var mySql = " SELECT m_Task.* FROM m_Task  ORDER BY TaskID;";
    //console.log(mySql);
    var recordSet = database.Execute(mySql);
    var TaskBox = document.getElementById('TaskDisplay' + labCounter);
    TaskBox.innerHTML = "";
    var tempHtml = '<select name="selectTask' + labCounter + '" id="selectTask' + labCounter + '" onchange="TaskCdchange(this,' + labCounter + ')" \">\n';
    tempHtml = tempHtml + '\t<option value="0">�I�����Ă��������B<\/option>\n';
    while (!recordSet.EOF) {
        //�I�v�V�����l�w�肪����ꍇ�͂��̃I�v�V������I����Ԃɂ���B
        if (recordSet(0) == Number(TaskCd)) {
            tempHtml = tempHtml + '\t<option value=" ' + TaskCd + '" selected >' + recordSet(1) + '<\/option>\n';
        } else {
            tempHtml = tempHtml + '\t<option value=" ' + recordSet(0) + '" >' + recordSet(1) + '<\/option>\n';
        }
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + '</select>';
    TaskBox.innerHTML = tempHtml;
    recordSet.Close();
    recordSet = null;
}

//*
//* ��ƃZ���N�g�{�b�N�X�X�V���̉�ʐ���
//*
function TaskCdchange(obj, Mcounter) {
    var laMcounter = Mcounter;
    var workCd = obj.value;
    if (obj.selectedIndex == 0) {
        var seltask = document.getElementById("selectTask");
        alert("��Ƃ�I�����Ă��������B");
        obj.focus();
        return;
    }
    var mtSelect = document.getElementById('TaskCdDisplay' + laMcounter)
    mtSelect.innerHTML = "";
    var tempHtml = '<span id="TaskCd' + laMcounter + '"\">' + workCd + '<\/span>';
    mtSelect.innerHTML = tempHtml;
}



//*****************************************************************************
//
// �G���[�`�F�b�N�֘A
//
//******************************************************************************
//*
//* �f�[�^���`�F�b�N����֐�
//*
function dataCheck(CheckValue, Chckflg, Chkcount) {
    var focucCnt = Chkcount;
    var tempStr = "�͕K�����͂��Ă��������B";
    var txtCd = document.getElementById('txtPlanCd' + Chkcount);
    var txtDetail = document.getElementById('txtMemo' + Chkcount);
    var sel1Cd = document.getElementById('selMatterCd' + Chkcount);
    var sel2Cd = document.getElementById('selTaskCd' + Chkcount);
    if (Chckflg == 0 && CheckValue == "") {
        alert("��^���ID" + tempStr);
        txtCd.focus();
        return false;
    }
    if (Chckflg == 1 && CheckValue == "") {
        alert("��^���" + tempStr);
        txtDetail.focus();
        return false;
    }
    return true;
}

//*
//* ��{���j�A�s���v��A�Č��̕����񕪊��p
//*
function StringSeparator(objString) {
    var sobj = objString;
    var separator = "-";
    var allayworkCd = sobj.split(separator);
    var robj = allayworkCd[1];
    return robj;
}


//*****************************************************************************
//
// ��^��Ƃ�����ʂɃR�s�[����
//
//******************************************************************************

//*
//* �I���{�^�������œ����ʂɒ�^��Ɠ��e���R�s�[
//*�@�Q��URL:http://www.tagindex.com/javascript/window/sub_to_main.html
//*          http://webapp.winofsql.jp/webclass101128172259.htm
//*          http://www.nandani.sakura.ne.jp/web_all/javascript/32/
//*
function selectRoutine(Pcounter,Row) {
    if (Pcounter == 0) {
        alert("��^��Ɠo�^����Ă��Ȃ��̂őI���ł��܂���B");
    } else {
    if (!window.opener || window.opener.closed) {
        window.alert('���C���E�B���h�E������܂���'); 
    }else{
        //var Value = "���e" + TxtMemo + "�A�Č�:" + SelectB1 + "�A���ID:" + TaskID;
        var TxtMemo = document.getElementById('txtMemo' + Row).innerHTML;
        var AdminID = document.getElementById('AdministrationCd' + Row).innerText;         //��{���j
        var ActionID = document.getElementById('ActionPlanCd' + Row).innerText;            //�s���v��
        var MatterID = document.getElementById('MatterCd' + Row).innerText;                  //�Č�ID
        var SelectB1 = Number(AdminID) + '-' + Number(ActionID) + '-' + Number(MatterID)                //�Č��Z���N�g�{�b�N�X�p��ID
        var TaskID = Number(document.getElementById('TaskCd' + Row).innerText);                      //���ID
        //���сE�⑫���ւ̃R�s�[
        var ParentTxt = window.opener.document.getElementById('txtReportMemo' + Pcounter);
        ParentTxt.value = TxtMemo;
        //�Č��̃R�s�[
        var MatterDisp = window.opener.document.getElementById('MatterCdDisplay' + Pcounter);
        var tempHtml = '<span id="AdministrationCd' + Pcounter + '"\">' + Number(AdminID) + '<\/span>' + '-' + '<span id=\"ActionPlanCd' + Pcounter + '\">' + Number(ActionID) + '<\/span>' + '-' + '<span id="MatterCd' + Pcounter + '"\">' + Number(MatterID) + '<\/span>';
        MatterDisp.innerHTML = tempHtml;
        var ParentMatter = window.opener.document.getElementById('selectMatter' + Pcounter).getElementsByTagName('option');
        for (i = 0; i < ParentMatter.length; i++) {
            if (ParentMatter[i].value == SelectB1) {
                ParentMatter[i].selected = true;
                break;
            }
        }
        //��Ƃ̃R�s�[
        var TaskDisp = window.opener.document.getElementById('TaskCdDisplay' + Pcounter);
        var tempHtmlT = '<span id="TaskCd' + Pcounter + '"\">' + TaskID + '<\/span>';
        TaskDisp.innerHTML = tempHtmlT;
        var ParentTask = window.opener.document.getElementById('selectTask' + Pcounter).getElementsByTagName('option');
        for (i = 0; i < ParentTask.length; i++) {
            if (ParentTask[i].value == TaskID) {
                ParentTask[i].selected = true;
                break;
            }
        }
        window.close();
    }
   }
}