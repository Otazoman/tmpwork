//-------------------------------------------------------------------
// ����o�^�p���W���[��
//  2013/6/12           Ver1.0  Created By M.Nishimura
//  2013/7/3            Ver1.1  ����ID�\���������P(�s��Ή�)�A���R�[�h�����Ή�
//�@2013/12/2           Ver1.2  ��^��Ɠo�^�A�ďo�@�\�ǉ�
//�@2013/12/18          Ver1.3  �c�Ǝ��ԊǗ��@�\�ǉ� 
//  2017/2/27           Ver1.4  �㕔���j���[�Œ艻�ɔ����v�f���擾�̕s��C��
//  2017/5/25           Ver1.5  �ʓ��t�o�^���W�b�N�s��C��
//                              ���t�@�N�^�����O
//                              �Ј��R�[�h�����̊O����
//                              �Č��ƍ�ƃR���{�{�b�N�X����̊O����
//  �@�\�F����o�^��ʂ̐��䓙���s��
//-------------------------------------------------------------------

var EmpCd = location.search.substring(1);     //���O�C����ʂ���S����CD�擾

onload = init;
onunload = dbClose;

//*
//* �ǉ��{�^���������ɓ��͍��ڂ�ǉ�����B
//*
var ItemField = {
    //div�v�f�̒��ōő��itemNO���擾����currentNumber�ɃZ�b�g����B
    currentNumber: 0,
    itemTemplate: '<table border="1" style ="width:1200px" ><tr><td>����ID�@:<input type="text" name="txtReportCd__count__" id="txtReportCd__count__" style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="" \/>'
                 + '��ƌv��ID�@:<input type="text" name="txtPlanCd__count__" id="txtPlanCd__count__" style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="�|" \/>'
                 + '�Č�:<span id="MatterCdDisplay__count__"></span>'
                 + '<span id="MatterDisplay__count__"></span>'
                 + '���:<span id="TaskCdDisplay__count__"></span>'
                 + '<span id="TaskDisplay__count__"></span>'
                 + '<br/>��Ɨ\��:<textarea name="txtTaskMemo__count__" id="txtTaskMemo__count__" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">�|<\/textarea>'
                 + '���сE�⑫:<textarea name="txtReportMemo__count__" id="txtReportMemo__count__" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"><\/textarea>'
                 + '<input type="button" name="btnStart__count__" id="btnStart__count__" value="�J�n" onclick="startTimeUpdate(txtReportCd__count__.value,txtPlanCd__count__.value,txtReportMemo__count__.value,txtTime__count__.value,txtRefarence__count__.value,__count__)" \/>'
                 + '<input type="button" name="btnEnd__count__" id="btnEnd__count__" value="�I��" onclick="endTimeUpdate(txtReportCd__count__.value,txtPlanCd__count__.value,txtReportMemo__count__.value,txtTime__count__.value,txtRefarence__count__.value,__count__)" \/>'
                 + '����:<input type="text" name="txtTime__count__" id="txtTime__count__" style ="width:40px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="0" \/>'
                 + '<br/>�֘A����:<input type="text" name="txtRefarence__count__" id="txtRefarence__count__" style ="width:600px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="�|" \/><\/td>'
                 + '<td><input type="button" name="btnInsert__count__" id="btnInsert__count__" value="�o�^" onclick="btnActionSelect(txtReportCd__count__.value,txtPlanCd__count__.value,txtReportMemo__count__.value,txtTime__count__.value,txtRefarence__count__.value,__count__,0)" \/>'
                 + '<input type="button" name="btnDelete__count__" id="btnDelete__count__" value="�폜"  onclick="btnActionSelect(txtReportCd__count__.value,txtPlanCd__count__.value,txtReportMemo__count__.value,txtTime__count__.value,txtRefarence__count__.value,__count__,1)" \/>'
                 + '<br/><input type="button" name="btnSTout__count__" id="btnSTout__count__" value="��^��ƌďo" onclick="winOpenRoutine(\'Routine.html\',__count__)" \/><\/td><\/tr></table>',
    //���ڒǉ�
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
        MatterCdDisplay(this.currentNumber, 0);
        TaskCdDisplay(this.currentNumber, "0");
        field.appendChild(new_area);
        //�e�L�X�g�{�b�N�X�ǉ����ɍ�ƌv��ID�Ƀt�H�[�J�X
        var nxtfield = document.getElementById('txtReportCd' + this.currentNumber);
        //2�Ԗڈȍ~�̍��ڂł͑O�s�̓���ID�l���擾����B
        if (beforeNumber != 0) {
            var beforefield = document.getElementById('txtReportCd' + beforeNumber);
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
        var chkPCdTxtbox = document.getElementById('txtReportCd' + this.currentNumber);
        var chkMCdTxtbox = document.getElementById('txtReportMemo' + this.currentNumber);
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
            var beforefield = document.getElementById('txtReportCd' + this.currentNumber);
            if (this.currentNumber == 0) {
                return;
            } //�ŏI�s���O
            beforefield.focus();
        } else {
            alert("���̓f�[�^�����݂��܂�");
            var currentfield = document.getElementById('txtReportCd' + this.currentNumber);
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
//*�@�����ݒ������֐�
//*
function init() {
    //�񍐓��\��
    txtReportday = document.getElementById("txtReportday");
    var txtdate = new DateFormat("yyyy/MM/dd");
    txtdate = txtdate.format(new Date());
    txtReportday.value = txtdate;
    //�v����̃e�L�X�g�{�b�N�X����
    txtReportday.onblur = function () {
        this.style.backgroundColor = "#ffffff";
    }
    document.getElementById("btnDaySearch").onclick = function () {
        txtDateUpdate(txtReportday);
    }
    document.getElementById("btnDailyPlan").onclick = function () {
        winOpen("DailyPlanInput.html");
    }
    document.getElementById("btnSumWorkTime").onclick = function () {
        txtTimeUpdate();
    }
    //�O��������R�s�[�{�^��
    document.getElementById("btnBeforeDataCopy").onclick = function () {
        beforeDairyReportCopy();
    }
    dbConnect(); //�f�[�^�x�[�X�ڑ�
    // �S���҂��Z�b�g���ĉ�ʂ̏����\��
    EmpCdisplay(EmpCd);
    DisPlayChecker();
    //��Ǝ��Ԍv�Z
    var SumwSubmmit = document.getElementById("btnSumWorkTime");
    SumwSubmmit.click();
    //�c�Ɠo�^�{�^��
    document.getElementById("btnovertime").onclick = function () {
        overTimeOperate();
    }
    //�c�Ǝ��ԕ\��
    overTimeinit(EmpCd, txtdate);
}

//*
//*�@�I������
//*
function OperateEnd() {
    dbClose();
    (window.open('', '_self').opener = window).close();
}

//*
//*�@�񍐓��X�V���̏���
//*
function txtDateUpdate(obj) {
    DisPlayChecker();
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
function btnActionSelect(ReportID, WorkplanID, Memo, whour, Refar, txtCount, selectMode) {
    var sCount = txtCount;        //���ڈʒu�擾�p
    //�񍐓���I�����Ă��Ȃ��ꍇ�̃`�F�b�N
    var Reportday = document.getElementById('txtReportday').value;
    if (ChckDate(Reportday)) {
    } else {
        return;
    }
    //�S����I�����Ă��Ȃ��ꍇ�̃`�F�b�N
    var selEmp = document.getElementById('selectEmpId');
    if (ChckEmp(selEmp)) {
        if (selEmp.selectedIndex == 0) {
            alert("�S���҂�I�����Ă��������B");
            selEmp.focus();
            return;
        }
    }
    //�Č��ƍ�Ƃ�I�����Ă��Ȃ��ꍇ�̃`�F�b�N
    var selMatter = document.getElementById('selectMatter' + sCount);
    if (ChckMatter(selMatter, sCount)) {
    } else {
        return;
    }
    var selTask = document.getElementById('selectTask' + sCount);
    if (ChckTask(selTask, sCount)) {
    } else {
        return;
    }

    //    �K�v���ڗރZ�b�g
    var rId = Number(ReportID);                                                             //����ID
    var wId = WorkplanID;
    var reMemo = Memo;                                                                      //���сE�⑫
    var Reportday = document.getElementById('txtReportday').value;                          //�񍐓�
    var EmpID = EmpCd;                                                                      //�S����
    var AdminID = document.getElementById('AdministrationCd' + sCount).innerText;           //��{���j
    var ActionID = document.getElementById('ActionPlanCd' + sCount).innerText;              //�s���v��
    var MatterID = document.getElementById('MatterCd' + sCount).innerText;                  //�Č�ID
    var TaskID = document.getElementById('TaskCd' + sCount).innerText;                      //���ID
    var Whour = whour;                                                                      //��Ǝ���
    var Refe = Refar;                                                                         //�֘A����
    //DB�o�^�󋵊m�F
    var mySql = " SELECT Count(ReportID) AS CountRid "
                + " FROM t_dailyreport "
                + " WHERE ( ReportID =" + rId + ") AND ( Empid ='" + EmpID + "') AND (Reportday ='" + Reportday + "');";
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
    //    console.log(mySql);
    if (selectMode == 1) {
        //�폜
        dataDelete(rId, EmpID, Reportday, sCount);
        return;
    }
    if (selectMode == 0 && idcount == 0) {
        //�ǉ�
        dataInsert(rId, wId, AdminID, ActionID, MatterID, TaskID, Reportday, reMemo, Refe, EmpID, Whour, sCount);
    } else {
        //�X�V
        dataUpdate(rId, wId, AdminID, ActionID, MatterID, TaskID, Reportday, reMemo, Refe, EmpID, Whour, sCount);
    }
}

//*
//*�@�񍐓��ɓ���o�^�����݂��邩�𔻕ʂ��ĕ\������֐�
//*
function DisPlayChecker() {
    //�񍐓��`�F�b�N
    var Reportday = document.getElementById('txtReportday').value;
    var EmpID = EmpCd;
    if (ChckDate(Reportday)) {
    } else {
        return;
    }
    var mySql = " SELECT COUNT(WorkplanID) AS WIDCount" + " FROM t_workplan"
                     + " WHERE (PlanDate='" + Reportday + "') AND (Empid='" + EmpID + "') AND (DeleteFlg = '0' );";
    var recordSet = database.Execute(mySql);
    var wPlanCount = recordSet(0);

    var mySql = " SELECT COUNT(ReportID) AS RIDCount "
           + " FROM t_dailyreport "
           + " WHERE (Reportday='" + Reportday + "') AND (Empid='" + EmpID + "') AND (DeleteFlg = '0' );";
    var recordSet = database.Execute(mySql);
    var ReportCount = recordSet(0);
    //����ID�̓o�^���Ȃ���΍�ƌv��̂ݕ\��
    if (ReportCount == 0 && wPlanCount == 0) {
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
        //��Ǝ��ԍČv�Z
        var SumwSubmmit = document.getElementById("btnSumWorkTime");
        SumwSubmmit.click();
        //�c�Ǝ��ԕ\��
        overTimeinit(EmpID, Reportday)
        //�c�Ǝ��ԗ݌v�v�Z
        return;
    }
    //����ID�����݂��Ȃ��ꍇ�͍�ƌv��݂̂�\������B    
    if (ReportCount == 0) {
        workPlanView();
    } else {
        dataDisplay();
    }
    recordSet.Close();
    recordSet = null;
    //��Ǝ��ԍČv�Z
    var SumwSubmmit = document.getElementById("btnSumWorkTime");
    SumwSubmmit.click();
    //�c�Ǝ��ԕ\��
    overTimeinit(EmpID, Reportday)
    //�c�Ǝ��ԗ݌v�v�Z
}

//*
//*�@�Y�����̍�ƌv����ďo���ĉ�ʂɕ\������B
//*
function workPlanView() {
    var Reportday = document.getElementById('txtReportday').value;
    if (ChckDate(Reportday)) {
    } else {
        return;
    }
    try {
        var EmpID = EmpCd;
        var mySql = " SELECT WorkplanID, AdministrationID, ActionplanID, MatterID, TaskID ,Planmemo " + " FROM t_workplan"
                         + " WHERE (PlanDate='" + Reportday + "') AND (Empid='" + EmpID + "') AND (DeleteFlg = '0' ) ORDER BY  WorkplanID ;";
        var recordSet = database.Execute(mySql);
        var counter = 1;
        var tempHtml = "";
        while (!recordSet.EOF) {
            tempHtml = '<table border="1"  style ="width:1130px" ><tr><td>����ID�@:<input type="text" name="txtReportCd' + counter + '" id="txtReportCd' + counter + '"  style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + counter + '" \/>'
                    + '��ƌv��ID�@:<input type="text" name="txtPlanCd' + counter + '" id="txtPlanCd' + counter + '" style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(0) + '" \/>'
                    + '�Č�:<span id="MatterCdDisplay' + counter + '"></span>'
                    + '<span id="MatterDisplay' + counter + '"></span>'
                    + '���:<span id="TaskCdDisplay' + counter + '"></span>'
                    + '<span id="TaskDisplay' + counter + '"></span>'
                    + '<br/>��Ɨ\��:<textarea name="txtTaskMemo' + counter + '" id="txtTaskMemo' + counter + '" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">' + recordSet(5) + '<\/textarea>'
                    + '���сE�⑫:<textarea name="txtReportMemo' + counter + '" id="txtReportMemo' + counter + '" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"><\/textarea>'
                    + '<input type="button" name="btnStart' + counter + '" id="btnStart' + counter + '" value="�J�n" onclick="startTimeUpdate(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ')" \/>'
                    + '<input type="button" name="btnEnd' + counter + '" id="btnEnd' + counter + '" value="�I��" onclick="endTimeUpdate(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ')" \/>'
                    + '����:<input type="text" name="txtTime' + counter + '" id="txtTime' + counter + '"  style ="width:40px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="0" \/>'
                    + '<br/>�֘A����:<input type="text" name="txtRefarence' + counter + '" id="txtRefarence' + counter + '" style ="width:600px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="�|" \/><\/td>'
                    + '<td><input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="�o�^" onclick="btnActionSelect(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ',0)" \/>'
                    + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="�폜" onclick="btnActionSelect(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ',1)" \/>'
                    + '<br/><input type="button" name="btnSTout' + counter + '" id="btnSTout' + counter + '" value="��^��ƌďo" onclick="winOpenRoutine(\'Routine.html\',' + counter + ')" \/><\/td><\/tr><\/table>';
            var field = document.getElementById('item' + counter);
            var workPlanID = recordSet(0);
            var newItem = tempHtml;
            field.innerHTML = newItem;
            var nextNumber = counter + 1;
            var new_area = document.createElement("div");
            new_area.setAttribute("id", "item" + nextNumber);
            new_area.setAttribute("class", "table");
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
//*�@����f�[�^��\������֐�
//*
function dataDisplay() {
    try {
        var cWork = "�|";
        //���񕔕�
        var Reportday = document.getElementById('txtReportday').value;
        ChckDate(Reportday);
        var EmpId = EmpCd;
        var mySql = " SELECT ReportID,WorkplanID,AdministrationID,ActionplanID,MatterID,TaskID,Reportday,Dailymemo,Workinghours,Reference "
                     + " FROM t_dailyreport "
                     + " WHERE (Reportday='" + Reportday + "') AND (Empid='" + EmpId + "') AND (DeleteFlg = '0' ) ORDER BY  ReportID ;";
        var recordSet = database.Execute(mySql);
        //alert(mySql);
        //console.log(mySql);
        var counter = 1;
        var tempHtml = "";
        while (!recordSet.EOF) {
            tempHtml = '<table border="1"  style ="width:1130px" ><tr><td>����ID�@:<input type="text" name="txtReportCd' + counter + '" id="txtReportCd' + counter + '" style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(0) + '" \/>'
                    + '��ƌv��ID�@:<input type="text" name="txtPlanCd' + counter + '" id="txtPlanCd' + counter + '" style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(1) + '" \/>'
                    + '�Č�:<span id="MatterCdDisplay' + counter + '"></span>'
                    + '<span id="MatterDisplay' + counter + '"></span>'
                    + '���:<span id="TaskCdDisplay' + counter + '"></span>'
                    + '<span id="TaskDisplay' + counter + '"></span>'
                    + '<br/>��Ɨ\��:<textarea name="txtTaskMemo' + counter + '" id="txtTaskMemo' + counter + '" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"><\/textarea>'
                    + '���сE�⑫:<textarea name="txtReportMemo' + counter + '" id="txtReportMemo' + counter + '" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">' + recordSet(7) + '<\/textarea>'
                    + '<input type="button" name="btnStart' + counter + '" id="btnStart' + counter + '" value="�J�n" onclick="startTimeUpdate(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ')" \/>'
                    + '<input type="button" name="btnEnd' + counter + '" id="btnEnd' + counter + '" value="�I��" onclick="endTimeUpdate(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ')" \/>'
                    + '����:<input type="text" name="txtTime' + counter + '" id="txtTime' + counter + '" style ="width:40px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(8) + '" \/>'
                    + '<br/>�֘A����:<input type="text" name="txtRefarence' + counter + '" id="txtRefarence' + counter + '" style ="width:600px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(9) + '" \/><\/td>'
                    + '<td><input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="�o�^" onclick="btnActionSelect(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ',0)" \/>'
                    + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="�폜" onclick="btnActionSelect(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ',1)" \/>'
                    + '<br/><input type="button" name="btnSTout' + counter + '" id="btnSTout' + counter + '" value="��^��ƌďo" onclick="winOpenRoutine(\'Routine.html\',' + counter + ')" \/><\/td><\/tr><\/table>';
            var field = document.getElementById('item' + counter);
            var workPlanID = recordSet(1);
            var newItem = tempHtml;
            field.innerHTML = newItem;
            var nextNumber = counter + 1;
            var new_area = document.createElement("div");
            new_area.setAttribute("id", "item" + nextNumber);
            new_area.setAttribute("class", "table");
            field.appendChild(new_area);
            //��Ɨ\��\��
            if (workPlanID == cWork || workPlanID == null || workPlanID == undefined) {
                var TaskMemo = document.getElementById('txtTaskMemo' + counter);
                TaskMemo.value = cWork;
            } else {
                mySubSql = " SELECT t_dailyreport.ReportID, t_workplan.WorkplanID, t_workplan.AdministrationID, t_workplan.ActionplanID, t_workplan.MatterID, t_workplan.TaskID,Planmemo "
                    + " FROM t_dailyreport INNER JOIN t_workplan ON (t_workplan.PlanDate = t_dailyreport.Reportday) "
                    + " AND (t_dailyreport.Empid = t_workplan.Empid) AND (t_dailyreport.WorkplanID = t_workplan.WorkplanID) "
                    + " WHERE (((t_dailyreport.Empid)='" + EmpId + "') AND ((t_dailyreport.Reportday)='" + Reportday + "') AND ((t_dailyreport.DeleteFlg)='0') AND ((t_workplan.DeleteFlg)='0')) "
                    + "AND ((t_workplan.WorkplanID)='" + workPlanID + "');";
                SubrecordSet = database.Execute(mySubSql);
                //alert(mySubSql);
                //console.log(mySubSql);
                var WPMemo = SubrecordSet(6);
                var TaskMemo = document.getElementById('txtTaskMemo' + counter);
                TaskMemo.value = WPMemo;
                SubrecordSet.Close();
                SubrecordSet = null;
            }
            //�Č�ID�\��
            var Mcd = Number(recordSet(2)) + '-' + Number(recordSet(3)) + '-' + Number(recordSet(4));
            MatterCdDisplay(counter, Mcd);
            var mdSelect = document.getElementById('MatterCdDisplay' + counter)
            mdSelect.innerHTML = "";
            var tempHtml = '<span id="AdministrationCd' + counter + '"\">' + recordSet(2) + '<\/span>' + '-' + '<span id=\"ActionPlanCd' + counter + '\">' + recordSet(3) + '<\/span>' + '-' + '<span id="MatterCd' + counter + '"\">' + recordSet(4) + '<\/span>';
            mdSelect.innerHTML = tempHtml;
            //���ID�\���\���p
            var Tcd = recordSet(5);
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
        //��Ǝ��Ԍv�Z
        var SumwSubmmit = document.getElementById("btnSumWorkTime");
        SumwSubmmit.click();
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*�@�f�[�^��ǉ�����֐�
//*
function dataInsert(ReportID, WorkplanID, AdminID, ActionID, MatterID, TaskID, Reportday, ReportMemo, Reference, EmpID, Workinghours, Chkcount) {
    try {
        //�o�^�p�����擾
        var btnCnt = Chkcount;
        var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
        OperateDate = dateFormat.format(new Date());

        //��ƌv�悪�ݒ肳��Ă��邩�̊m�F
        var cWork = "�|";
        var checker = wPlanChecker(WorkplanID,Reportday);
        if (checker==false){
            WorkplanID = cWork;
        }

        //�f�[�^�ǉ�
        if (dataCheck(ReportID, 0, Chkcount) && dataCheck(ReportMemo, 1, Chkcount)) {
            var mySql = " INSERT INTO t_dailyreport (ReportID,WorkplanID,AdministrationID,ActionplanID,MatterID,TaskID,Reportday,Dailymemo,Reference,Empid,Workinghours,Creationdate,DeleteFlg ) "
                         + " VALUES (" + Number(ReportID) + ",'" + WorkplanID + "','" + AdminID + "','" + ActionID + "','" + MatterID + "','" + TaskID + "','" + Reportday + "','" + ReportMemo + "','" + Reference + "','" + EmpID + "','" + Workinghours + "','" + OperateDate + "','0');";
            database.Execute(mySql);
            //console.log(mySql);
            alert("�f�[�^��ǉ����܂����B");
            //��^��ƂƂ��Ēǉ����邩�̊m�F
            var selRoutine = confirm("��^��ƂƂ��Ēǉ����܂����H");
            if (selRoutine == true) {
                RoutineWorkInsert(btnCnt);
            }
            //��ʍĕ`�攻��
            ViewUpdateChck(btnCnt);
            var nextnum = btnCnt + 1;
            var nxtMatter = document.getElementById('selectMatter' + nextnum);
            //���̈Č��Z���N�g�{�b�N�X������ꍇ�̓t�H�[�J�X�ړ�
            if (nxtMatter) {
                nxtMatter.focus();
                //��Ǝ��Ԍv�Z
                var SumwSubmmit = document.getElementById("btnSumWorkTime");
                SumwSubmmit.click();
            }
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*�@�f�[�^���X�V����֐�
//*
function dataUpdate(ReportID, WorkplanID, AdminID, ActionID, MatterID, TaskID, Reportday, ReportMemo, Reference, EmpID, Workinghours, Chkcount) {
    try {
        //�o�^�p�����擾
        var btnCnt = Chkcount;
        var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
        OperateDate = dateFormat.format(new Date());
        if (dataCheck(ReportID, 0, btnCnt) && dataCheck(ReportMemo, 1, btnCnt)) {
            var mySql = " UPDATE t_dailyreport SET WorkplanID = '" + WorkplanID + "', AdministrationID = '" + AdminID + "', ActionplanID = '" + ActionID
                        + "', MatterID = '" + MatterID + "', TaskID = '" + TaskID + "', Reportday = '" + Reportday + "', Dailymemo = '" + ReportMemo
                        + "', Reference = '" + Reference + " ', EmpID = '" + EmpID + " ', Workinghours = '" + Workinghours + " ', UpdateDate = '" + OperateDate + "',"
			            + " DeleteFlg ='0' WHERE ( ReportID = " + Number(ReportID) + " ) AND ( Empid = '" + EmpID + "' )  AND ( Reportday = '" + Reportday + "' );";
            //alert(mySql);
            //console.log(mySql);
            database.Execute(mySql);
            alert("�X�V���܂����B");
            //�ǉ���ɒǉ��������сE�⑫��\������
            var cWork = "�|";
            var WkplanId = document.getElementById('txtPlanCd' + btnCnt);
            var ckWk = WkplanId.value;
            var Report = document.getElementById('txtReportMemo' + btnCnt).value;
            var Report = ReportMemo;
            var Refer = document.getElementById('txtRefarence' + btnCnt).value;
            var Refer = Reference;
            var nextnum = btnCnt + 1;
            var nxtMatter = document.getElementById('selectMatter' + nextnum);
            //���̈Č��Z���N�g�{�b�N�X������ꍇ�̓t�H�[�J�X�ړ�
            if (nxtMatter) {
                nxtMatter.focus();
                //��Ǝ��Ԍv�Z
                var SumwSubmmit = document.getElementById("btnSumWorkTime");
                SumwSubmmit.click();
            }
            //��ʍĕ`�攻��
            ViewUpdateChck(btnCnt);
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*�@�f�[�^���폜����֐�
//*
function dataDelete(ReportID, EmpID, Reportday, Chkcount) {
    try {
        //�o�^�p�����擾
        var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
        OperateDate = dateFormat.format(new Date());
        if (dataCheck(ReportID, 0, Chkcount)) {
            var mySql = " UPDATE t_dailyreport SET DeleteFlg ='1', DeleteDate = '" + OperateDate + "'"
			            + " WHERE ( ReportID = " + Number(ReportID) + " ) AND ( Empid = '" + EmpID + "' )  AND ( Reportday = '" + Reportday + "' );";
            //console.log(mySql);
            database.Execute(mySql);
            alert("�폜���܂����B");
            ItemField.clear();
            dataDisplay();
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*�@�J�n���Ԃ��f�[�^�x�[�X�ɓo�^����B�@�@�@#�C���Ώ�(��ƌv��̃`�F�b�N)
//*
function startTimeUpdate(ReportID, WorkplanID, Memo, whour, Refar, txtCount) {
    //�o�^�p�����擾
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
    OperateDate = dateFormat.format(new Date());
    var Chkcount = txtCount;        //���ڈʒu�擾�p
    //�񍐓�����ђS����I�����Ă��Ȃ��ꍇ�̃`�F�b�N
    var Reportday = document.getElementById('txtReportday').value;
    var selEmp = document.getElementById('selectEmpId');
    if (ChckDate(Reportday) && ChckEmp(selEmp)) {
    } else {
        return;
    }
    //�Č��ƍ�Ƃ�I�����Ă��Ȃ��ꍇ�̃`�F�b�N
    var selMatter = document.getElementById('selectMatter' + Chkcount);
    var selTask = document.getElementById('selectTask' + Chkcount);
    if (ChckMatter(selMatter, Chkcount) && ChckTask(selTask, Chkcount)) {
    } else {
        return;
    }
    //�K�v���ڗރZ�b�g
    var rId = Number(ReportID);                                                             �@ //����ID
    var wId = WorkplanID;
    var ReportMemo = Memo;                                                                    //���сE�⑫
    var Reportday = document.getElementById('txtReportday').value;                            //�񍐓�
    var EmpID = EmpCd;                                                                        //�S����
    var AdminID = document.getElementById('AdministrationCd' + Chkcount).innerText;           //��{���j
    var ActionID = document.getElementById('ActionPlanCd' + Chkcount).innerText;              //�s���v��
    var MatterID = document.getElementById('MatterCd' + Chkcount).innerText;                  //�Č�ID
    var TaskID = document.getElementById('TaskCd' + Chkcount).innerText;                      //���ID
    var Workinghours = whour;                                                                 //��Ǝ���
    var Reference = Refar;                                                                    //�֘A����
    try {
        var mySql = " SELECT Count(ReportID) AS CountRid "
                    + " FROM t_dailyreport "
                    + " WHERE ( Empid ='" + EmpID + "') AND (Reportday ='" + Reportday + "') AND (ReportID=" + rId + ");";
        var recordSet = database.Execute(mySql);
        var idcount = recordSet(0);
        //alert(mySql);
        //console.log(mySql);

        //��ƌv�悪�ݒ肳��Ă��邩�̊m�F
        var cWork = "�|";
        var checker = wPlanChecker(WorkplanID,Reportday);
        if (checker==false){
            WorkplanID = cWork;
        }

        if (idcount == 0) {
            if (dataCheck(ReportID, 0, Chkcount) && dataCheck(ReportMemo, 1, Chkcount)) {
                var mySql = " INSERT INTO t_dailyreport (ReportID,WorkplanID,AdministrationID,ActionplanID,MatterID,TaskID,Reportday,Dailymemo,Reference,Empid,Workinghours,Taskstart,Creationdate,DeleteFlg ) "
                            + " VALUES (" + Number(ReportID) + ",'" + WorkplanID + "','" + AdminID + "','" + ActionID + "','" + MatterID + "','" + TaskID + "','" + Reportday + "','" + ReportMemo + "','" + Reference + "','" + EmpID + "','" + Workinghours + "','" + OperateDate + "','" + OperateDate + "','0');";
                database.Execute(mySql);
                //console.log(mySql);
                alert("�ǉ����܂����B");
                //��^��ƂƂ��Ēǉ����邩�̊m�F
                var selRoutine = confirm("��^��ƂƂ��Ēǉ����܂����H");
                if (selRoutine == true) {
                    RoutineWorkInsert(Chkcount);
                }
                //��ʍĕ`�攻��
                ViewUpdateChck(Chkcount);
                var nextnum = Chkcount + 1;
                var nxtMatter = document.getElementById('selectMatter' + nextnum);
                //���̈Č��Z���N�g�{�b�N�X������ꍇ�̓t�H�[�J�X�ړ�
                if (nxtMatter) {
                    nxtMatter.focus();
                }
            }
        } else {
            if (dataCheck(ReportID, 0, Chkcount) && dataCheck(ReportMemo, 1, Chkcount)) {
                var mySql = " UPDATE t_dailyreport SET Taskstart = '" + OperateDate + " ', UpdateDate = '" + OperateDate + "'"
			            + " WHERE ( ReportID = " + Number(ReportID) + " ) AND ( Empid = '" + EmpID + "' )  AND ( Reportday = '" + Reportday + "' ) AND DeleteFlg ='0' ;";
                //alert(mySql);
                //console.log(mySql);
                database.Execute(mySql);
                var nextnum = Chkcount + 1;
                var nxtMatter = document.getElementById('selectMatter' + nextnum);
                //���̈Č��Z���N�g�{�b�N�X������ꍇ�̓t�H�[�J�X�ړ�
                if (nxtMatter) {
                    nxtMatter.focus();
                }
                alert("�X�V���܂����B");
            }
        }
        recordSet.Close();
        recordSet = null;
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*�@�I�����Ԃ��f�[�^�x�[�X�ɓo�^���A��Ǝ��Ԃ��v�Z����B
//*
function endTimeUpdate(ReportID, WorkplanID, Memo, whour, Refar, txtCount) {
    //�o�^�p�����擾
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
    OperateDate = dateFormat.format(new Date());
    var Chkcount = txtCount;        //���ڈʒu�擾�p
    //�񍐓�����ђS����I�����Ă��Ȃ��ꍇ�̃`�F�b�N
    var Reportday = document.getElementById('txtReportday').value;
    var selEmp = document.getElementById('selectEmpId');
    if (ChckDate(Reportday) && ChckEmp(selEmp)) {
    } else {
        return;
    }
    //�Č��ƍ�Ƃ�I�����Ă��Ȃ��ꍇ�̃`�F�b�N
    var selMatter = document.getElementById('selectMatter' + Chkcount);
    var selTask = document.getElementById('selectTask' + Chkcount);
    if (ChckMatter(selMatter, Chkcount) && ChckTask(selTask, Chkcount)) {
    } else {
        return;
    }
    //�K�v���ڗރZ�b�g
    var rId = Number(ReportID);                                                             //����ID
    var wId = WorkplanID;
    var ReportMemo = Memo;                                                                  //���сE�⑫
    var Reportday = document.getElementById('txtReportday').value;                          //�񍐓�
    var EmpID = EmpCd;                                                                      //�S����
    var AdminID = document.getElementById('AdministrationCd' + Chkcount).innerText;         //��{���j
    var ActionID = document.getElementById('ActionPlanCd' + Chkcount).innerText;            //�s���v��
    var MatterID = document.getElementById('MatterCd' + Chkcount).innerText;                  //�Č�ID
    var TaskID = document.getElementById('TaskCd' + Chkcount).innerText;                      //���ID
    var Workinghours = whour;                                                                 //��Ǝ���
    var Reference = Refar;                                                                    //�֘A����
    try {
        var mySql = " SELECT Count(ReportID) AS CountRid "
                    + " FROM t_dailyreport "
                    + " WHERE ( Empid ='" + EmpID + "') AND (Reportday ='" + Reportday + "') AND (ReportID=" + Number(ReportID) + ");";
        var recordSet = database.Execute(mySql);
        var idcount = recordSet(0);
        //alert(mySql);
        //console.log(mySql);
        if (idcount == 0) {
            alert("��ɊJ�n�{�^���������Ă��������B")
            return;
        }
        if (dataCheck(ReportID, 0, Chkcount) && dataCheck(ReportMemo, 1, Chkcount)) {
            //�J�n�����擾
            var mySql = " SELECT Taskstart  FROM t_dailyreport "
                            + " WHERE (ReportID = " + Number(ReportID) + ") AND (Reportday ='" + Reportday + "') AND "
                            + " (Empid='" + EmpID + "') AND (DeleteFlg='0');";
            //alert(mySql);
            //console.log(mySql);
            var recordSet = database.Execute(mySql);
            var startTime = recordSet(0);
            //�I������-�J�n�����ō�Ǝ��Ԃ��Z�o
            WorkTime = DateCalculate(startTime, OperateDate);
            var mySql = " UPDATE t_dailyreport SET Taskend = '" + OperateDate + " ', UpdateDate = '" + OperateDate + " ', Workinghours = '" + WorkTime + "' WHERE ( ReportID = " + Number(ReportID) + " )"
                            + " AND ( Empid = '" + EmpID + "' )  AND ( Reportday = '" + Reportday + "' ) AND DeleteFlg ='0' ;";
            //alert(mySql);
            //console.log(mySql);
            database.Execute(mySql);
            var wkTime = document.getElementById('txtTime' + Chkcount);
            wkTime.value = WorkTime;
            alert("�X�V���܂����B");
            var nextnum = Chkcount + 1;
            var nxtMatter = document.getElementById('selectMatter' + nextnum);
            //���̈Č��Z���N�g�{�b�N�X������ꍇ�̓t�H�[�J�X�ړ�
            if (nxtMatter) {
                nxtMatter.focus();
                //��Ǝ��Ԍv�Z
                var SumwSubmmit = document.getElementById("btnSumWorkTime");
                SumwSubmmit.click();
            }
        }
        recordSet.Close();
        recordSet = null;
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*     ��Ɨ\��ƍ�Ǝ��т����ʂ���ʍX�V�𔻒肷��֐�
//*
function ViewUpdateChck(btnCount) {
    var CurrentNum = btnCount;
    var evntCnt = btnCount;
    var cWork = "�|";
    var viewflg = "0";
    //�J�����_�[�̃��W�b�N��div�v�f��2�g�p����Ă��ĈӐ}���Ȃ�div���E���Ă���̂ł��̑Ή�
    var chkerNumber = document.getElementsByClassName("table").length - 1;
    for (var i = 1; i <= chkerNumber; i++) {
        var j = i;
        var RepNo = document.getElementById('txtReportCd' + i).value;
        var WkplanMemo = document.getElementById('txtTaskMemo' + i).value;
        var DailyRepMemo = document.getElementById('txtReportMemo' + i).value;
        if (WkplanMemo !== cWork && DailyRepMemo == "" || DailyRepMemo == null || DailyRepMemo == undefined) {
            viewflg = "1"
            break;
        }
        if (WkplanMemo == cWork && DailyRepMemo !== "" || DailyRepMemo !== null || DailyRepMemo !== undefined) {
            viewflg = "2"
        }
    }
    //��ʍX�V�\�ȏꍇ�͉�ʍX�V
    if (viewflg == "0") {
        dataDisplay();
    }
    if (CurrentNum == chkerNumber) {
        ItemField.add();
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
    var txtCd = document.getElementById('txtReportCd' + Chkcount);
    var txtDetail = document.getElementById('txtReportMemo' + Chkcount);
    var txtovertime = document.getElementById('txtovertime');

    if (Chckflg == 0 && CheckValue == "") {
        alert("����ID" + tempStr);
        txtCd.focus();
        return false;
    }
    if (Chckflg == 1 && CheckValue == "") {
        alert("���сE�⑫" + tempStr);
        txtDetail.focus();
        return false;
    }
    //2013/12/16�@�ǉ�
    if (Chckflg == 2 && CheckValue == "") {
        alert("�c�Ǝ���" + tempStr);
        txtovertime.focus();
        return false;
    }
    return true;
}

//*
//* �񍐓��`�F�b�N
//*
function ChckDate(Reportday) {
    if (Reportday) {
    } else {
        txtReportday = document.getElementById("txtReportday");
        alert("�񍐓��͕K�{�ł��B");
        txtReportday.focus();
        return false;
    }
    return true;
}


//*
//* �S���҃R�[�h�`�F�b�N
//*
function ChckEmp(Employ) {
    if (Employ) {
    } else {
        var selEmp = document.getElementById('selectEmpId');
        alert("�S���҂�I�����Ă��������B");
        selEmp.focus();
        return false;
    }
    return true;
}

//*
//* �Č��`�F�b�N
//*
function ChckMatter(Matter, Chkcount) {
    var selMatter = document.getElementById('selectMatter' + Chkcount);
    if (selMatter.value == 0) {
        alert("�Č���I�����Ă��������B");
        selMatter.focus();
        return false;
    }
    return true;
}

//*
//* ��ƃ`�F�b�N
//*
function ChckTask(Task, Chkcount) {
    var selTask = document.getElementById('selectTask' + Chkcount);
    if (selTask.value == 0) {
        alert("��Ƃ�I�����Ă��������B");
        selTask.focus();
        return false;
    }
    return true;
}

//*
//* ��ƌv��`�F�b�N
//��ƌv��ID���u-�v�łȂ��ꍇ�͍�ƌv��ID�Ɂu-�v���Z�b�g���ēo�^����B(��ƌv��o�^�L����ʓ��t�ŕۑ�����ꍇ�̑΍�)
function wPlanChecker(WorkplanID,Reportday){
    var cWork = "�|";
    if (WorkplanID!==cWork){
        var mySql = " SELECT COUNT(WorkplanID) AS WIDCount"
                    + " FROM t_workplan"
                    + " WHERE (PlanDate='" + Reportday + "') AND (Empid='" + EmpID + "') AND (DeleteFlg = '0' );";
        //alert(mySql);
        //console.log(mySql);
        var recordSet = database.Execute(mySql);
        var wplanCount = recordSet(0);
        if(wplanCount==0){
            return false;
        }
    }
}

//*
//* �I������-�J�n�����̎��ԍ��v�Z
//*
function DateCalculate(StartTime, EndTime) {

    //���ԍ������߂Ď��ԁA���P�ʂɕϊ�����B
    var s = Date.parse(StartTime);
    var e = Date.parse(EndTime);
    var wkTime = e - s;
    var CTime = wkTime / 3600000;
    var rtn = CTime.toFixed(2)
    return rtn;
}

//*
//* ��ƌv��ďo
//*
function winOpen(target_site) {
    //�Ј��R�[�h��n���č�ƌv���ʂɑJ��
    var selEmp = document.getElementById('selectEmpId');
    var EmpCd = selEmp.value;
    if (ChckEmp(EmpCd)) {
        var child = target_site + "?" + EmpCd;
        subwin = window.open(child, "ChildWin", "top=50,left=500,width=1280,height=800,scrollbars=yes");
    }
}

//*
//* ��Ǝ��ԍČv�Z
//*
function txtTimeUpdate() {
    //�e�L�X�g�{�b�N�X�̒l�擾
    //�J�����_�[�̃��W�b�N��div�v�f��2�g�p����Ă��ĈӐ}���Ȃ�div���E���Ă���̂ł��̑Ή�
    var eleNumber = document.getElementsByClassName("table").length - 1;
    var sumTime = 0;
    //�e�L�X�g�{�b�N�X���̎��Ԃ��W�v
    for (var i = 1; i < eleNumber; i++) {
        var Timefield = document.getElementById('txtTime' + i);
        var wktime = parseFloat(Timefield.value);
        sumTime = parseFloat(sumTime) + wktime;
    }
    var sumTimeField = document.getElementById('txtSumWorkTime');
    //���Ԃ�X.XX�`���ɏC�����ĕ\��
    sumTime = sumTime * 100;
    sumTime = Math.round(sumTime);
    sumTime = sumTime / 100;
    sumTimeField.value = sumTime;
    var overTimeSum = document.getElementById('txtovertime');
    if (sumTime >= 8.0) {
      var diffTime;
      diffTime = sumTime - 8;
      diffTime = diffTime * 100;
      diffTime = Math.round(diffTime);
      diffTime = diffTime / 100;
      overTimeSum.value = diffTime;  
    }
}

//*****************************************************************************
//
// �ǉ��@�\
//
//******************************************************************************

//*
//*�@�O��������R�s�[
//*
function beforeDairyReportCopy() {
    //�񍐓��`�F�b�N
    var Reportday = document.getElementById('txtReportday').value;
    var BefDay;
    if (ChckDate(Reportday)) {
        var txtdate = new DateFormat("yyyy/MM/dd");
        txtdate = txtdate.format(new Date(Reportday));
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
    var checker = existReport(BefDay);
    alert("�O�����͕��̓���̓��e��\�����܂��B\n�i�O�������Ȃ���Ήߋ�10���ȓ��̓��̓f�[�^��\�����܂��B�j\n��ʕ\����ɓo�^�{�^���������Γ���f�[�^�x�[�X�ɔ��f����܂��B");
    for (var i = 1; i <= 11; i++) {
        if (checker == true) {
            BeforeDairyReportView(BefDay);
            break;
        }
        BefDay = DaymainusCalculate(BefDay);
        checker = existReport(BefDay)
    }
}

//*
//*�@���R�[�h�̑��݊m�F
//*
function existReport(Reportday) {
    var EmpID = EmpCd;
    var mySql = " SELECT COUNT(ReportID) AS RIDCount "
           + " FROM t_dailyreport "
           + " WHERE (Reportday='" + Reportday + "') AND (Empid='" + EmpID + "') AND (DeleteFlg = '0' );";
    var recordSet = database.Execute(mySql);
    var ReportCount = recordSet(0);
    if (ReportCount == 0) {
        return false;
    } else {
        return true;
    }
}


//*
//*�@�O���������ʕ\��
//*
function BeforeDairyReportView(BefReportday) {
    var cWork = "�|";
    //���񕔕�
    ChckDate(BefReportday);
    var EmpId = EmpCd;
    var mySql = " SELECT ReportID,WorkplanID,AdministrationID,ActionplanID,MatterID,TaskID,Reportday,Dailymemo,Workinghours,Reference "
                         + " FROM t_dailyreport "
                         + " WHERE (Reportday='" + BefReportday + "') AND (Empid='" + EmpId + "') AND (DeleteFlg = '0' ) ORDER BY  ReportID ;";
    var recordSet = database.Execute(mySql);
    //alert(mySql);
    //console.log(mySql);
    var counter = 1;
    var tempHtml = "";
    while (!recordSet.EOF) {
        tempHtml = '<table border="1"  style ="width:1130px" ><tr><td>����ID�@:<input type="text" name="txtReportCd' + counter + '" id="txtReportCd' + counter + '" style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + counter + '" \/>'
                    + '��ƌv��ID�@:<input type="text" name="txtPlanCd' + counter + '" id="txtPlanCd' + counter + '" style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + cWork + '" \/>'
                    + '�Č�:<span id="MatterCdDisplay' + counter + '"></span>'
                    + '<span id="MatterDisplay' + counter + '"></span>'
                    + '���:<span id="TaskCdDisplay' + counter + '"></span>'
                    + '<span id="TaskDisplay' + counter + '"></span>'
                    + '<br/>��Ɨ\��:<textarea name="txtTaskMemo' + counter + '" id="txtTaskMemo' + counter + '" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">' + cWork + '<\/textarea>'
                    + '���сE�⑫:<textarea name="txtReportMemo' + counter + '" id="txtReportMemo' + counter + '" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">' + recordSet(7) + '<\/textarea>'
                    + '<input type="button" name="btnStart' + counter + '" id="btnStart' + counter + '" value="�J�n" onclick="startTimeUpdate(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ')" \/>'
                    + '<input type="button" name="btnEnd' + counter + '" id="btnEnd' + counter + '" value="�I��" onclick="endTimeUpdate(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ')" \/>'
                    + '����:<input type="text" name="txtTime' + counter + '" id="txtTime' + counter + '" style ="width:40px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + 0 + '" \/>'
                    + '<br/>�֘A����:<input type="text" name="txtRefarence' + counter + '" id="txtRefarence' + counter + '" style ="width:600px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + cWork + '" \/><\/td>'
                    + '<td><input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="�o�^" onclick="btnActionSelect(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ',0)" \/>'
                    + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="�폜" onclick="btnActionSelect(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ',1)" \/>'
                    + '<br/><input type="button" name="btnSTout' + counter + '" id="btnSTout' + counter + '" value="��^��ƌďo" onclick="winOpenRoutine(\'Routine.html\',' + counter + ')" \/><\/td><\/tr><\/table>';
        var field = document.getElementById('item' + counter);
        var newItem = tempHtml;
        field.innerHTML = newItem;
        var nextNumber = counter + 1;
        var new_area = document.createElement("div");
        new_area.setAttribute("id", "item" + nextNumber);
        new_area.setAttribute("class", "table");
        field.appendChild(new_area);
        //�Č�ID�\��
        var Mcd = Number(recordSet(2)) + '-' + Number(recordSet(3)) + '-' + Number(recordSet(4));
        MatterCdDisplay(counter, Mcd);
        var mdSelect = document.getElementById('MatterCdDisplay' + counter)
        mdSelect.innerHTML = "";
        var tempHtml = '<span id="AdministrationCd' + counter + '"\">' + recordSet(2) + '<\/span>' + '-' + '<span id=\"ActionPlanCd' + counter + '\">' + recordSet(3) + '<\/span>' + '-' + '<span id="MatterCd' + counter + '"\">' + recordSet(4) + '<\/span>';
        mdSelect.innerHTML = tempHtml;
        //���ID�\���\���p
        var Tcd = recordSet(5);
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
    //��Ǝ��Ԍv�Z
    var SumwSubmmit = document.getElementById("btnSumWorkTime");
    SumwSubmmit.click();
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

//*
//*�@��^��Ɠo�^
//*  2013/12/02�@AddedBy�@M.Nishimura
//*  
function RoutineWorkInsert(counter) {
    try {
        var EmpID = EmpCd;
        //�o�^�p�����擾
        var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
        OperateDate = dateFormat.format(new Date());
        var Chkcount = counter;        //���ڈʒu�擾�p
        //�񍐓�����ђS����I�����Ă��Ȃ��ꍇ�̃`�F�b�N
        var Reportday = document.getElementById('txtReportday').value;
        if (ChckDate(Reportday) && ChckEmp(EmpID)) {
        } else {
            return;
        }
        //�Č��ƍ�Ƃ�I�����Ă��Ȃ��ꍇ�̃`�F�b�N
        var selMatter = document.getElementById('selectMatter' + Chkcount);
        var selTask = document.getElementById('selectTask' + Chkcount);
        if (ChckMatter(selMatter, Chkcount) && ChckTask(selTask, Chkcount)) {
        } else {
            return;
        }
        var RoutineMemo = document.getElementById('txtReportMemo' + counter).value;
        if (dataCheck(RoutineMemo, 1, Chkcount)) {
            //��^��ƒǉ�
            var AdminID = document.getElementById('AdministrationCd' + counter).innerText;         //��{���j
            var ActionID = document.getElementById('ActionPlanCd' + counter).innerText;            //�s���v��
            var MatterID = document.getElementById('MatterCd' + counter).innerText;                  //�Č�ID
            var TaskID = document.getElementById('TaskCd' + counter).innerText;                      //���ID
            var mySql = " INSERT INTO m_RoutineWork (EmpID,AdministrationID,ActionplanID,MatterID,TaskID,RoutineMemo,Creationdate,DeleteFlg ) "
                  + " VALUES ('" + EmpID + "','" + AdminID + "','" + ActionID + "','" + MatterID + "','" + TaskID + "','" + RoutineMemo + "','" + OperateDate + "','0');";
            database.Execute(mySql);
            alert("��^��ƂƂ��Ēǉ����܂����B");
        } else {
            return;
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }

}
//*
//* ��^��ƌďo
//*  2013/12/02�@AddedBy�@M.Nishimura
//*  
function winOpenRoutine(target_site, TxtCnt) {
    var EmpID = EmpCd;
    var Reportday = document.getElementById('txtReportday').value;
    //�Ј��R�[�h��n���č�ƌv���ʂɑJ��
    if (ChckDate(Reportday) && ChckEmp(EmpID)) {
    } else {
        return;
    }
    var child = target_site + "?EmpCd=" + EmpID + "&TxtCnt=" + TxtCnt;
    subwin = window.open(child, "ChildWin", "top=50,left=500,width=1280,height=800,scrollbars=yes");
}

//*
//*�@�c�Ɨ��R��\������֐�
//*  2013/12/16�@AddedBy�@M.Nishimura
//*
function CauseCdisplay(CauseId) {
    var mySql = "SELECT * FROM m_Cause WHERE ( DeleteFlg = '0') ORDER BY CauseID";
    var recordSet = database.Execute(mySql);
    //console.log(mySql);
    document.getElementById("overtimecause").innerHTML = "";
    var tempHtml = "�c�Ɨ��R�F�@<select name=\"selectCauseCd\" id=\"selectCauseCd\">\n";
    tempHtml = tempHtml + "\t<option value=\"0\">�I�����Ă��������B</option>\n";
    while (!recordSet.EOF) {
        var optionval = recordSet(0);
        if (optionval == CauseId) {
            tempHtml = tempHtml + '\t<option value="' + optionval + '" selected >' + recordSet(0) + "�F" + recordSet(1) + '<\/option>\n';
        } else {
            tempHtml = tempHtml + '\t<option value="' + optionval + '"\">' + recordSet(0) + "�F" + recordSet(1) + '<\/option>\n';
        }
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + "</select>";
    //console.log(tempHtml);
    document.getElementById("overtimecause").innerHTML = tempHtml;
    selCauseCd = document.getElementById("selectCauseCd");
    selCauseCd.onchange = function () {
        selectCauseCdCdchange(this);
    }
    recordSet.Close();
    recordSet = null;
}

//*
//*�@�c�Ɨ��R�I�����̓���
//*  2013/12/16�@AddedBy�@M.Nishimura
//*
function selectCauseCdCdchange(obj) {
    var wCauseCd = obj.value;
    if (obj.selectedIndex == 0) {
        var selCause = document.getElementById("selectCauseCd");
        alert("�c�Ɨ��R��I�����Ă��������B");
        selCause.focus();
        return;
    } else {
        CauseCd = wCauseCd;
    }
}

//*
//* �c�Ɨ��R�R�[�h�`�F�b�N
//*  2013/12/16�@AddedBy�@M.Nishimura
//*
function ChckOverTime(Cause) {
    var selCause = document.getElementById('selectCauseCd');
    if (selCause.selectedIndex == 0) {
        alert("�c�Ɨ��R��I�����Ă��������B");
        selCause.focus();
        return;
    } else {
        false;
    }
    return true;
}

//*
//*�@�c�ƃe�[�u���ւ̒ǉ��E�X�V
//*  2013/12/16�@AddedBy�@M.Nishimura
//*
function overTimeOperate() {
    try {
        //�c�ƌ��x�v�Z�p
        var overTimeSum = document.getElementById('txtovtSum').value;
        //�񍐓��t
        var Reportday = document.getElementById('txtReportday').value;
        //�S����
        var EmpID = EmpCd;
        //�o�^�p�����擾
        var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
        var operateDate = dateFormat.format(new Date());
        //�񍐓�����ђS����I�����Ă��Ȃ��ꍇ�̃`�F�b�N
        if (ChckDate(Reportday) && ChckEmp(EmpID)) {
        } else {
            return;
        }
        //�c�Ǝ��ю��Ԃ����͂���Ă��Ȃ��ꍇ�̃`�F�b�N
        var overtimeval = document.getElementById('txtovertime').value;
        var ovplanval = document.getElementById('txtovplan').value;
        if (dataCheck(overtimeval, 2, '0')) {
        } else {
            return;
        }
        //�c�Ɨ��R�̃`�F�b�N
        var selCause = document.getElementById("selectCauseCd").value;
        if (ChckOverTime()) {
        } else {
            return;
        }
        //�c�Ǝ��у���
        var overtimeMemo = document.getElementById("txtovertimememo").value;

        //�\�����Ԃɂ��x��
        var targetTime = Number(ovplanval) + Number(overTimeSum)
        if (15 <= targetTime && targetTime < 30) {
            alert("15���Ԃ�˔j���Ă��܂��B�c�������m�F���A����̌����݊܂߂ĕ񍐂��Ă��������B");
        } else if (30 <= targetTime && targetTime < 45) {
            alert("�c�Ə���ł��B����ȏ�c�Ƃ���Ƒ̂ɓłł��B");
        } else if (45 <= targetTime && targetTime < 60) {
            alert("36����Ɉ����������Ă��܂��B����ȏ�c�Ƃ���̂͊댯�ł��B");
        } else if (60 <= targetTime && targetTime < 100) {
            alert("���_�I�Ɋ댯�ł��B���ĂɂȂ�Ȃ���������܂��񂪏�i�ɏ��������߂܂��傤�B");
        } else if (100 <= targetTime) {
            alert("���ƂɋA��܂��傤�B���̂܂܂ł͔p�l�ɂȂ�܂�");
        } else {
            alert("�\�����ԓ��ɋA���悤�ɂ��܂��傤�B");
        }
        var mySql = " SELECT Count(EmpID) AS Countovertime "
                    + " FROM  t_Overtime "
                    + " WHERE ( Empid ='" + EmpCd + "') AND (Workday ='" + Reportday + "');";
        var recordSet = database.Execute(mySql);
        var idcount = recordSet(0);
        //alert(mySql);
        //console.log(mySql);
        if (idcount == 0) {
            var ovaddmySql = "INSERT INTO t_Overtime ([Empid],[Workday],[Planhours],[Workinghours],[CauseID],[Memo],[Creationdate]) "
                            + " VALUES ('" + EmpID + "','" + Reportday + "','" + ovplanval + "','" + overtimeval + "'," + Number(selCause) + ",'" + overtimeMemo + "','" + operateDate + "');";
            //console.log(ovaddmySql);
            database.Execute(ovaddmySql);
            overTimeAppSendMail(EmpID,ovplanval,overtimeval,Number(selCause) ,overtimeMemo,Reportday);	//���[�����M
            alert("�c�Ƃ�\�����܂����B")
        } else {
            var ovupmySql = " UPDATE t_Overtime SET [Planhours] = '" + ovplanval + "', [Workinghours] = '" + overtimeval + "', [CauseID]=" + Number(selCause) + ",[UpdateDate] = '" + operateDate + "',[Memo] ='" + overtimeMemo + "'"
                            + " WHERE ( [Empid] = '" + EmpID + "' )  AND ( [Workday] = '" + Reportday + "' );";
            //console.log(ovupmySql);
            database.Execute(ovupmySql);
            overTimeRepSendMail(EmpID,overtimeval,Number(selCause) ,overtimeMemo,Reportday);	//���[�����M
            alert("�c�Ǝ��Ԃ��X�V���܂����B")
        }
        overTimeinit(EmpCd, Reportday)
        recordSet.Close();
        recordSet = null;

    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*�@�c�Ǝ��ԕ\��������
//*  2013/12/16�@AddedBy�@M.Nishimura
//*
function overTimeinit(EmpCd, txtdate) {
    var cWork = "�|";
    var overTime = document.getElementById('txtovertime');
    var ovPlan = document.getElementById('txtovplan');
    var overtimeMemo = document.getElementById('txtovertimememo');
    var mySql = " SELECT Count(EmpID) AS Countovertime "
                    + " FROM  t_Overtime "
                    + " WHERE ( Empid ='" + EmpCd + "') AND (Workday ='" + txtdate + "');";
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
    //alert(mySql);
    //console.log(mySql);
    if (idcount == 0) {
        //�c�Ǝ��ԂȂ��̏ꍇ�̕\���@
        ovPlan.value = '0.00';
        overTime.value = '0.00';
        CauseCdisplay(Number(0));
        overtimeMemo.value = '�|';
    } else {
        //�o�^�ώc�Ǝ��ԕ\��
        var ovmySql = " SELECT  Empid, Planhours ,Workinghours , CauseID ,Memo "
                    + " FROM  t_Overtime "
                    + " WHERE ( Empid ='" + EmpCd + "') AND (Workday ='" + txtdate + "');";
        //alert(ovmySql);
        //console.log(ovmySql);
        var recordSet = database.Execute(ovmySql);
        ovPlan.value = recordSet(1);
        overTime.value = recordSet(2);
        var CauseId = Number(recordSet(3));
        CauseCdisplay(CauseId);
        var CauseMemo = recordSet(4);
        if (CauseMemo == cWork || CauseMemo == null || CauseMemo == undefined) {
            overtimeMemo.value = cWork;
        } else {
            overtimeMemo.value = CauseMemo;
        }
    }
    recordSet.Close();
    recordSet = null;
    //�c�Ǝ��ԍ��v�\��
    overTimeMonthSum(EmpCd, txtdate)
}

//*
//*�@�c�Ǝ��ԍ��v�v�Z
//*  2013/12/17�@AddedBy�@M.Nishimura
//*
function overTimeMonthSum(EmpCd, txtdate) {
    var ovPlanSum = document.getElementById('txtovpSum');
    var overTimeSum = document.getElementById('txtovtSum');
    //�񍐓����猎���擾���A��������1�����擾����B
    //�Q��URL:http://www.happyquality.com/2013/07/24/2680.htm
    var Reportday = document.getElementById('txtReportday').value;
    if (ChckDate(Reportday)) {
        var dy = new DateFormat("yyyy");
        var ReportYear = dy.format(new Date(Reportday));
        var dm = new DateFormat("MM");
        var ReportMonth = dm.format(new Date(Reportday));
        lastDay = new Date(ReportYear, (ReportMonth - 1) + 1, 0).getDate();
        var qfD = ReportYear + "/" + ReportMonth + "/" + "01";
        var qlD = ReportYear + "/" + ReportMonth + "/" + lastDay;
    } else {
        return;
    }
    //�������t�𒊏o���c�Ǝ��ԍ��v���v�Z����B
    var mySql = " SELECT Count(EmpID) AS Countovertime "
                    + " FROM  t_Overtime "
                    + " WHERE ( Empid ='" + EmpCd + "') AND (Workday >='" + qfD + "' AND  Workday <='" + qlD + "');";
    //alert(mySql);
    //console.log(mySql);
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);

    if (idcount == 0) {
        //���R�[�h�Ȃ��̏ꍇ�̕\���@
        ovPlanSum.value = '0.00';
        overTimeSum.value = '0.00';
    } else {
        //�݌v���ԕ\��
        var sumSql = "SELECT Sum(t_Overtime.Planhours) AS PlanSum, Sum(t_Overtime.Workinghours) AS WorkiSum "
                    + " FROM t_Overtime "
                    + " WHERE ( Empid ='" + EmpCd + "') AND (Workday >='" + qfD + "' AND  Workday <='" + qlD + "');";
        //alert(ovmySql);
        //console.log(ovmySql);
        var recordSet = database.Execute(sumSql);
        //�c�Ɛ\���݌v
        var ovPSum = recordSet(0);
        ovPSum = ovPSum * 100;
        ovPSum = Math.round(ovPSum);
        ovPSum = ovPSum / 100;
        ovPlanSum.value = ovPSum;
        //�c�Ǝ��ї݌v
        var ovTSum = recordSet(1);
        ovTSum = ovTSum * 100;
        ovTSum = Math.round(ovTSum);
        ovTSum = ovTSum / 100;
        overTimeSum.value = ovTSum;
    }
    recordSet.Close();
    recordSet = null;
}