//-------------------------------------------------------------------
// ��ƌv��o�^�p���W���[��
//  2013/6/4  Ver1.0    Created By M.Nishimura
//  2013/7/3�@Ver1.1�@�@��ƌv��ID�\���������P
//  2013/7/10 Ver1.2    �O����ƌv��R�s�[�@�\�ǉ�
//  2017/2/27 Ver1.3    �㕔���j���[�Œ艻�ɔ����v�f���擾�̕s��C��
//                      �O������ƃR�s�[�@�\�̍폜�t���O�l���R��̏C��
//  2017/5/25 Ver1.4    ���t�@�N�^�����O
//                      �Ј��R�[�h�����̊O����
//                      �Č��ƍ�ƃR���{�{�b�N�X����̊O����
//  �@�\�F��ƌv��(�����̍�Ɨ\��(�����\��))�o�^��ʐ��䓙���s��
//-------------------------------------------------------------------

var EmpCd=location.search.substring(1);     //���O�C����ʂ���S����CD�擾

onload = init;
onunload = dbClose;

//*
//* �ǉ��{�^���������ɓ��͍��ڂ�ǉ�����B
//*
var ItemField = {
    //div�v�f�̒��ōő��itemNO���擾����currentNumber�ɃZ�b�g����B
    currentNumber: 0,
    itemTemplate: '<table style ="width:1180px" ><tr><td>��ƌv��ID�@:<input type="text" name="txtPlanCd__count__" id="txtPlanCd__count__"  style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="" \/>'
                 + '�Č�:<span id="MatterCdDisplay__count__"></span>' + '<span id="MatterDisplay__count__"></span>' + '���:<span id="TaskCdDisplay__count__"></span>'
                 + '<span id="TaskDisplay__count__"></span>'
                 + '��Ɨ\��:<textarea name="txtMemo__count__" id="txtMemo__count__" cols="24" rows="3"  onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">��Ɨ\�����͂��Ă��������B<\/textarea><\/td>'
                 + '<td><input type="button" name="btnInsert__count__" id="btnInsert__count__" value="�o�^" onclick="btnActionSelect(txtPlanCd__count__.value,txtMemo__count__.value,__count__,0)" \/>'
                 + '<input type="button" name="btnDelete__count__" id="btnDelete__count__" value="�폜" onclick="btnActionSelect(txtPlanCd__count__.value,txtMemo__count__.value,__count__,1)" \/>',
    add: function () {
        //�e�L�X�g�{�b�N�X�̍Ō�̗v�f�ԍ��擾
        //�J�����_�[�̃��W�b�N��div�v�f��2�g�p����Ă��ĈӐ}���Ȃ�div���E���Ă���̂ł��̑Ή�
        var eleNumber = document.getElementsByClassName("table").length - 1;
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
        new_area.setAttribute("class", "table");
        MatterCdDisplay(this.currentNumber,0);
        TaskCdDisplay(this.currentNumber,"0");
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
        //�J�����_�[�̃��W�b�N��div�v�f��2�g�p����Ă��ĈӐ}���Ȃ�div���E���Ă���̂ł��̑Ή�
        var clNumber = document.getElementsByClassName("table").length - 1;
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
    //�v����\��
    txtPlanDate = document.getElementById("txtPlanDate");
    var txtdate = new DateFormat("yyyy/MM/dd");
    txtdate = txtdate.format(new Date());
    var NextDay = DayCalculate(txtdate);
    txtdate = NextDay;
    txtPlanDate.value = txtdate;
    //�v����̃e�L�X�g�{�b�N�X����
    txtPlanDate.onblur = function () {
        this.style.backgroundColor = "#ffffff";
    }
    document.getElementById("btnDaySearch").onclick = function() {
        txtDateUpdate(txtPlanDate);
    }
    //�O��������R�s�[�{�^��
    document.getElementById("btnBeforeDataCopy").onclick = function () {
        beforeDairyPlanCopy();
    }
    dbConnect(); //�f�[�^�x�[�X�ڑ�
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //�o�^�p�����擾
    OperateDate = dateFormat.format(new Date());
    // �S���҂��Z�b�g���ĉ�ʂ̏����\��
    EmpCdisplay(EmpCd);
    dataDisplay(txtdate);
}

//*
//* �I������
//*
function OperateEnd() {
    dbClose();
    (window.open('', '_self').opener = window).close();
}

//*
//* �v����X�V���̏���
//*
function txtDateUpdate(obj) {
    planDateUpdate();
    obj.style.backgroundColor = "#ffffff";
}

//*****************************************************************************
//
// �f�[�^����֘A
//
//******************************************************************************

//*
//*�@�f�[�^�x�[�X�ւ̒ǉ��E�폜�E�X�V���f
//*
function btnActionSelect(WorkplanID, Memo, txtCount,selectMode) {
    var sCount=txtCount;        //���ڈʒu�擾�p
    //��ƌv�����I�����Ă��Ȃ��ꍇ�̃`�F�b�N
    var PlanDate = document.getElementById('txtPlanDate').value;
    if (PlanDate) {
    } else {
        alert("�\����͕K�{�ł��B");
        txtPlanDate = document.getElementById("txtPlanDate");
        txtPlanDate.focus();
        return;
    }
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
    var wid = WorkplanID;
    var plMemo = Memo;
    var PlanDate = document.getElementById('txtPlanDate').value;
    dataCheck(WorkplanID, 0, sCount);
    var EmpID = EmpCd;
    var AdminID = document.getElementById('AdministrationCd' + sCount).innerText;
    var ActionID = document.getElementById('ActionPlanCd' + sCount).innerText;
    var MatterID = document.getElementById('MatterCd' + sCount).innerText;
    var TaskID = document.getElementById('TaskCd' + sCount).innerText;
    //DB�o�^�󋵊m�F
    var mySql = " SELECT Count(WorkplanID) AS CountWid "
                +" FROM t_workplan "
                + " WHERE ( WorkplanID ='" + wid + "') AND ( Empid ='" + EmpID + "') AND (PlanDate ='" + PlanDate + "');";
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
//    console.log(mySql);
    if (selectMode == 1) {
        //�폜
        dataDelete(wid, EmpID, PlanDate, sCount);
        return;
    }
    if (selectMode == 0 && idcount == 0) {
        //�ǉ�
        dataInsert(wid, plMemo, AdminID, ActionID, MatterID, TaskID, EmpID, PlanDate, sCount);
    } else {
        //�X�V
        dataUpdate(wid, plMemo, AdminID, ActionID, MatterID, TaskID, EmpID, PlanDate, sCount);
    }
}

//*
//* ��ƌv������X�V�����ۂɉ�ʂ��ĕ`�悷��֐�
//*
function planDateUpdate() {
    //��ƌv����`�F�b�N
    var PlanDate = document.getElementById('txtPlanDate').value;
    if (ChckDate(PlanDate)) {
    } else {
        return;
    }
    var EmpID = EmpCd;
    var mySql = " SELECT Count(WorkplanID) AS CountWid "
                + " FROM t_workplan "
                + " WHERE ( Empid ='" + EmpID + "') AND (PlanDate ='" + PlanDate + "') AND (DeleteFlg ='0');";
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
        dataDisplay(PlanDate);
    }
    recordSet.Close();
    recordSet = null;
}

//*
//* �f�[�^��\������֐�
//*
function dataDisplay(PlanDay) {
    try {
        var PlanDate = PlanDay;
        ChckDate(PlanDate);
        var EmpId = EmpCd;
        var mySql = " SELECT WorkplanID, AdministrationID, ActionplanID, MatterID, TaskID ,Planmemo " + " FROM t_workplan"
                     + " WHERE (PlanDate='" + PlanDate + "') AND (Empid='" + EmpId + "') AND (DeleteFlg = '0' ) ORDER BY  WorkplanID ;";
        var recordSet = database.Execute(mySql);
        //console.log(mySql);
        var counter = 1;
        var tempHtml = "";
        while (!recordSet.EOF) {
            tempHtml = '<table style ="width:1180px" ><tr><td>��ƌv��ID�@:<input type="text" name="txtPlanCd' + counter + '" id="txtPlanCd' + counter + '" style ="width:30px"  onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(0) + '" \/>'
                         + '�Č�:<span id="MatterCdDisplay' + counter + '"></span>' + '<span id="MatterDisplay' + counter + '"></span>'
                         + '���:<span id="TaskCdDisplay' + counter + '" ></span>' + '<span id="TaskDisplay' + counter + '"></span>'
                         + '��Ɨ\��:<textarea name="txtMemo' + counter + '" id="txtMemo' + counter + '" cols="24" rows="3"  onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">' + recordSet(5) + ' <\/textarea><\/td>'
                         + '<td><input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="�o�^" onclick="btnActionSelect(txtPlanCd' + counter + '.value,txtMemo' + counter + '.value,' + counter + ',0)" \/>'
                         + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="�폜" onclick="btnActionSelect(txtPlanCd' + counter + '.value,txtMemo' + counter + '.value,' + counter + ',1)" \/><\/td><\/tr></table>';
            var field = document.getElementById('item' + counter);
            var newItem = tempHtml;
            field.innerHTML = newItem;
            var nextNumber = counter + 1;
            var new_area = document.createElement("div");
            new_area.setAttribute("id", "item" + nextNumber);
            new_area.setAttribute("class", "table");
            field.appendChild(new_area);
            //�Č�ID�\��
            var Mcd = Number(recordSet(1)) + '-' + Number(recordSet(2)) + '-' + Number(recordSet(3));
            MatterCdDisplay(counter,Mcd);
            var mdSelect = document.getElementById('MatterCdDisplay' + counter)
            mdSelect.innerHTML = "";
            var tempHtml = '<span id="AdministrationCd' + counter + '"\">' + recordSet(1) + '<\/span>' + '-' + '<span id=\"ActionPlanCd' + counter + '\">' + recordSet(2) + '<\/span>' + '-' + '<span id="MatterCd' + counter + '"\">' + recordSet(3) + '<\/span>';
            mdSelect.innerHTML = tempHtml;
            //���ID�\���\���p
            var Tcd = recordSet(4);
            TaskCdDisplay(counter,Tcd);
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
function dataInsert(WorkplanID, PMemo, AdminID, ActionID, MatterID, TaskID, EmpID, PlanDate, Chkcount) {
    try {
        if (dataCheck(WorkplanID, 0, Chkcount) && dataCheck(PMemo, 1, Chkcount)) {
            var nextNum = Chkcount + 2;
            var nextItem = document.getElementById('item' + nextNum);
            var mySql = " INSERT INTO t_workplan ( WorkplanID, AdministrationID, ActionplanID, MatterID, TaskID, Planmemo, Empid, PlanDate, Creationdate, DeleteFlg ) "
                         + " VALUES ('" + WorkplanID + "','" + AdminID + "','" + ActionID + "','" + MatterID + "','" + TaskID + "','" + PMemo + "','" + EmpID + "','" + PlanDate + "','" + OperateDate + "','0');";
            database.Execute(mySql);
            alert("�ǉ����܂����B");
            //�ŏI�s�̃e�L�X�g�{�b�N�X�Ȃ�s�ǉ�
            if (nextItem) {
                return;
            }else{
                dataDisplay(PlanDate);
            }
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//* �f�[�^���X�V����֐�
//*
function dataUpdate(WorkplanID, PMemo, AdminID, ActionID, MatterID, TaskID, EmpID, PlanDate, Chkcount) {
    try {
        if (dataCheck(WorkplanID, 0, Chkcount) && dataCheck(PMemo, 1, Chkcount)) {
            var mySql = " UPDATE t_workplan SET AdministrationID ='" + AdminID + "', ActionplanID = '" + ActionID + "', MatterID = '" + MatterID + "', TaskID = '" + TaskID + "', Planmemo = '" + PMemo + " ', UpdateDate = '" + OperateDate + "',"
			            +" DeleteFlg ='"+ '0' + "'  WHERE ( WorkplanID = '" + WorkplanID + "' ) AND ( Empid = '" + EmpID + "' )  AND ( PlanDate = '" + PlanDate + "' );";
//            console.log(mySql);
            database.Execute(mySql);
            alert("�X�V���܂����B");
            dataDisplay(PlanDate);
       }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//* �f�[�^���폜����֐�
//*
function dataDelete(WorkplanID, EmpID, PlanDate, Chkcount) {
    try {
        if (dataCheck(WorkplanID, 0, Chkcount)) {
            var mySql = " UPDATE t_workplan SET DeleteFlg ='1', DeleteDate = '" + OperateDate + "'"
			            + " WHERE ( WorkplanID = '" + WorkplanID + "' ) AND ( Empid = '" + EmpID + "' )  AND ( PlanDate = '" + PlanDate + "' );";
            //      console.log(mySql);
            database.Execute(mySql);
            alert("�폜���܂����B");
            ItemField.clear();
            dataDisplay(PlanDate);
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
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
        alert("��ƌv��ID" + tempStr);
        txtCd.focus();
        return false;
    }
    if (Chckflg == 1 && CheckValue == "") {
        alert("��Ɠ��e" + tempStr);
        txtDetail.focus();
        return false;
    }
    return true;
    if (Chckflg == 2 && CheckValue == "" ) {
        alert("��Ɨ\���" + tempStr);
        sel1Cd.focus();
        return false;
    }
    return true;
}

//*
//* ��ƌv����`�F�b�N
//*
function ChckDate(PlanDate) {
    if (PlanDate) {
    } else {
        txtPlanDate = document.getElementById("txtPlanDate");
        alert("�\����͕K�{�ł��B");
        txtPlanDate.focus();
        return false;
    }
    return true;
}


//*
//* �������t���Z�b�g����
//*
function DayCalculate(TargetDay) {
    //���ԍ������߂Ď��ԁA���P�ʂɕϊ�����B
    var tD = Date.parse(TargetDay);
    var after=1;                             //1�����Z����B
    after = after * 24 * 60 * 60 * 1000;     //���Z�����~���b�֕ϊ�
    var wkTime = new Date(tD+after);
    var txtdate = new DateFormat("yyyy/MM/dd");
    var rtnDate = txtdate.format(new Date(wkTime));
    var rtn = rtnDate;
    return rtn;
}

//*****************************************************************************
//
// �ǉ��@�\
//
//******************************************************************************

//*
//*�@�O������ƌv��R�s�[
//*
function beforeDairyPlanCopy() {
    //�񍐓��`�F�b�N
    var PlanDate = document.getElementById('txtPlanDate').value;
    var BefDay;
    if (ChckDate(PlanDate)) {
        var txtdate = new DateFormat("yyyy/MM/dd");
        txtdate = txtdate.format(new Date(PlanDate));
        BefDay = DaymainusCalculate(txtdate);
    } else {
        return;
    }

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
    //�ő�10�����m�F
    var checker = existPlan(BefDay);
    alert("�O�����͕��̍�ƌv��̓��e��\�����܂��B\n�i�O�������Ȃ���Ήߋ�10���ȓ��̓��̓f�[�^��\�����܂��B�j\n��ʕ\����ɓo�^�{�^���������Γ���f�[�^�x�[�X�ɔ��f����܂��B");
    for (var i = 1; i <= 11; i++) {
        if (checker == true) {
            //��ƌv��\��
            dataDisplay(BefDay);
            break;
        }
        BefDay = DaymainusCalculate(BefDay);
        checker = existPlan(BefDay)
    }
}

//*
//*�@���R�[�h�̑��݊m�F
//*
function existPlan(PlanDate) {
    var EmpID = EmpCd;
    var mySql = " SELECT Count(WorkplanID) AS CountWid "
                + " FROM t_workplan "
                + " WHERE ( Empid ='" + EmpID + "') AND (PlanDate ='" + PlanDate + "')" 
                + "AND (DeleteFlg = '0');";
    var recordSet = database.Execute(mySql);
    var PlanCount = recordSet(0);
    if (PlanCount == 0) {
        return false;
    } else {
        return true;
    }
}


//*
//* �O�����t���Z�b�g����
//*
function DaymainusCalculate(TargetDay) {
    //���ԍ������߂Ď��ԁA���P�ʂɕϊ�����B
    var tD = Date.parse(TargetDay);
    var after = 1;                             //1�����Z����B
    after = after * 24 * 60 * 60 * 1000;     //���Z�����~���b�֕ϊ�
    var wkTime = new Date(tD - after);
    var txtdate = new DateFormat("yyyy/MM/dd");
    var rtnDate = txtdate.format(new Date(wkTime));
    var rtn = rtnDate;
    return rtn;
}