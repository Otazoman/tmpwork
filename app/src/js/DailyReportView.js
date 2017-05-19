//-------------------------------------------------------------------
// ����\���p���W���[��
//  2013/6/24  Ver1.0    Created By M.Nishimura
//  2013/7/18  Ver1.1    EXCEL����ւ̏o�͋@�\�ǉ�
//�@2013/9/17�@Ver1.2�@�@ �o�͏��O�t���O�ǉ�
//  2013/12/4  Ver1.3    �\����͋@�\�ǉ�
//  2017/5/19 Ver1.4     ���t�@�N�^�����O(�Ј��R�[�h�����̊O����)
//
//  �@�\�F����o�^��ʂœo�^��������̕\�����s��
//-------------------------------------------------------------------

var EmpCd=location.search.substring(1);     //���O�C����ʂ���S����CD�擾

onload = init;
onunload = dbClose;

//*
//*�@�����ݒ������֐�
//*
function init() {
    //�񍐓�(��)�\��
    txtReportdayF = document.getElementById("txtReportdayF");
    var txtdate = new DateFormat("yyyy/MM/dd");
    txtdate = txtdate.format(new Date());
    txtReportdayF.value = txtdate;
    //�񍐓�(��)�\��
    txtReportdayT = document.getElementById("txtReportdayT");
    var txtdate = new DateFormat("yyyy/MM/dd");
    txtdate = txtdate.format(new Date());
    var NextDay = DayCalculate(txtdate);
    txtReportdayT.value = NextDay;
    //�������̃e�L�X�g�{�b�N�X����
    txtReportdayF.onblur = function () {
        this.style.backgroundColor = "#ffffff";
    }
    txtReportdayT.onblur = function () {
        this.style.backgroundColor = "#ffffff";
    }
    //���񌟍��{�^������
    document.getElementById("btnDaySearch").onclick = function () {
        txtDateUpdate(txtReportdayF);
    }
    //EXCEL�ۑ��{�^������
    document.getElementById("btnToExcel").onclick = function () {
           toExcel();
    }
    dbConnect(); //�f�[�^�x�[�X�ڑ�
    // �S���҂��Z�b�g���ĉ�ʂ̏����\��
    EmpCdisplay(EmpCd);
    DisPlayChecker();
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
//*�@�񍐓��ɓ���o�^�����݂��邩�𔻕ʂ��ĕ\������֐�
//*
function DisPlayChecker() {
    //�񍐓��`�F�b�N
    var ReportdayF = document.getElementById('txtReportdayF').value;
    var ReportdayT = document.getElementById('txtReportdayT').value;
    var EmpID = EmpCd;
    //�񍐓�(��)�`�F�b�N
    if (ChckDate(ReportdayF)) {
    } else {
        return;
    }
    //�񍐓�(��)�`�F�b�N
    if (ReportdayT) {
    } else {
        ReportdayT = "9999/12/31";
    }
    var mySql = " SELECT COUNT(WorkplanID) AS WIDCount" + " FROM t_workplan"
                     + " WHERE (PlanDate >='" + ReportdayF + "' AND PlanDate <= '" + ReportdayT + "') AND (Empid='" + EmpID + "') AND (DeleteFlg = '0' );";
    var recordSet = database.Execute(mySql);
    var wPlanCount = recordSet(0);

    var mySql = " SELECT COUNT(ReportID) AS RIDCount "
           + " FROM t_dailyreport "
           + " WHERE (Reportday >='" + ReportdayF + "' AND Reportday <= '" + ReportdayT + "') AND (Empid='" + EmpID + "') AND (DeleteFlg = '0' );";
    var recordSet = database.Execute(mySql);
    var ReportCount = recordSet(0);
    //����̓o�^���Ȃ���Ή�ʂ��N���A����
    if (ReportCount == 0) {
        //0���̏ꍇ�͉�ʂ��N���A����B
        TableClear();
    }
    //����̓o�^������΃f�[�^��\������B    
    if (ReportCount != 0) {
        TableClear();
        dataDisplay();
    }
    recordSet.Close();
    recordSet = null;
}

//*
//*�@����f�[�^��\������֐�
//*
//* �Q��URL:http://www.abe-tatsuya.com/web_prog/javascript/add_table_rows.php
//*
function dataDisplay() {
    try {
        //��ƌv��o�^�Ȃ�
        var cWork = "�|";
        //���񕔕�
        //���񕔕�
        var ReportdayF = document.getElementById('txtReportdayF').value;
        var ReportdayT = document.getElementById('txtReportdayT').value;
        ChckDate(ReportdayF);
        //������(��)���󗓎���9999/12/31���Z�b�g
        if (ReportdayT) {
        } else {
            ReportdayT = "9999/12/31";
        }
        var EmpId = EmpCd;
        var mySql = " SELECT ReportID,WorkplanID,AdministrationID,ActionplanID,MatterID,TaskID,Reportday,Dailymemo,Workinghours,Reference,Reportday "
                     + " FROM t_dailyreport "
                     + " WHERE (t_dailyreport.Reportday >='" + ReportdayF + "' AND t_dailyreport.Reportday <= '" + ReportdayT + "') AND (Empid='" + EmpId + "') AND (DeleteFlg = '0' ) ORDER BY  AdministrationID,ActionplanID,MatterID,Reportday,ReportID ;";
        var recordSet = database.Execute(mySql);
        //alert(mySql);
        //console.log(mySql);
        var counter = 1;
        while (!recordSet.EOF) {
            //�e�[�u���ݒ�p
            var table1 = document.getElementById("table1");
            var row1 = table1.insertRow(counter);
            var cell1 = row1.insertCell(0);
            var cell2 = row1.insertCell(1);
            var cell3 = row1.insertCell(2);
            var cell4 = row1.insertCell(3);
            var cell5 = row1.insertCell(4);
            var cell6 = row1.insertCell(5);
            // class �̕t�^�� UserAgent �ɂ����
            // �������Ⴄ���ۂ��̂ŔO�̂��ߗ����̕��@��
            cell1.setAttribute("class", "excludeFlg");
            cell2.setAttribute("class", "ReportNo");
            cell3.setAttribute("class", "ActionPlan");
            cell4.setAttribute("class", "workPlan");
            cell5.setAttribute("class", "DailyReport");
            cell6.setAttribute("class", "Nextwork");
            cell1.className = 'excludeFlg';
            cell2.className = 'ReportNo';
            cell3.className = 'ActionPlan';
            cell4.className = 'workPlan';
            cell5.className = 'DailyReport';
            cell6.className = 'Nextwork';
            //��NO�ƍ������{������Ɠ��e�\���F����e�[�u������o�^����Ă��郌�R�[�h���擾
            var ReportId = recordSet(0);
            var workPlanID = recordSet(1);
            var Mcd = Number(recordSet(2)) + '-' + Number(recordSet(3)) + '-' + Number(recordSet(4));
            var MatterCd = Number(recordSet(2))+recordSet(3)+recordSet(4);
            var Tcd = recordSet(5);
            var ReportMemo = recordSet(7);
            var TaskHour = recordSet(8);
            var Reference = recordSet(9);
            var Reportday = recordSet(10)
            //������̓��t
            var tD = Date.parse(recordSet(6));
            var wkTime = new Date(tD);
            var bodydate = new DateFormat("M/d");
            bodydate = bodydate.format(wkTime);
            //���O�t���O Added 2013/9/17
            var HTML0 = '<input id ="excluF' + counter + '" type ="checkbox" value = "exclude_' + counter + '">';
            cell1.innerHTML = HTML0;
            //NO�����̃Z���\��
            var HTML1 = '<span id="ReportNo' + counter + '">'+ MatterCd + '</span>';
            cell2.innerHTML = HTML1;
            var HTML4 = '<span id ="DailyReport' + counter + '">'+ReportMemo + '</span>';
            //��Ɩ��擾
            myTaskSql = "SELECT m_Task.TaskID, m_Task.taskName "
                        + " FROM m_Task"
                        + " WHERE (((m_Task.TaskID)=" + Tcd + ") AND ((m_Task.DeleteFlg) Is Null));"
            TrecordSet = database.Execute(myTaskSql);
            var TaskName = TrecordSet(1);
            var RepHtml = '<span id="DailyReport' + counter + '">' + bodydate + " " + TaskName + "�F" + '</span>' + HTML4;
            TrecordSet.Close();
            TrecordSet = null;
            cell5.innerHTML = RepHtml;
            //���Z���ڕW�\���F��Ɨ\��擾
            var WPMemo = "";
            if (workPlanID == cWork || workPlanID == null || workPlanID == undefined) {
                WPMemo = cWork;
                var HTML3 = '<span id="workPlan' + counter + '">' + WPMemo + '</span>';
            } else {
                mySubSql = " SELECT t_dailyreport.ReportID, t_workplan.WorkplanID, t_workplan.AdministrationID, t_workplan.ActionplanID, t_workplan.MatterID, t_workplan.TaskID,Planmemo"
                    + " FROM t_dailyreport INNER JOIN t_workplan ON (t_workplan.PlanDate = t_dailyreport.Reportday) "
                    + " AND (t_dailyreport.Empid = t_workplan.Empid) AND (t_dailyreport.WorkplanID = t_workplan.WorkplanID) "
                    + " WHERE (((t_dailyreport.Empid)='" + EmpId + "') AND ((t_dailyreport.Reportday)='" + Reportday + "') AND ((t_dailyreport.DeleteFlg)='0') AND ((t_workplan.DeleteFlg)='0')) "
                    + "AND ((t_workplan.WorkplanID)='" + workPlanID + "');";
                SubrecordSet = database.Execute(mySubSql);
                //alert(mySubSql);
                //console.log(mySubSql);
                //�Z���ڕW
                var WPMemo = SubrecordSet(6);
                var HTML3 = '<span id="workPlan' + counter + '">' + bodydate + " " + WPMemo + '</span>';
                SubrecordSet.Close();
                SubrecordSet = null;
            }
            cell4.innerHTML = HTML3;
            //���s���v��/�Ɩ��ۑ�\���F�Č����擾(�Č�ID������ɈČ����\��)
            var separator = "-";
            var allayworkCd = Mcd.split(separator);
            var AdministrationCd = allayworkCd[0];
            var ActionPlanCd = allayworkCd[1];
            var MatterCd = allayworkCd[2];
            myMatterSql = "SELECT m_Matter.AdministrationID, m_Matter.ActionplanID, m_Matter.MatterID, m_Matter.MatterName "
                        + " FROM m_Matter "
                        + "WHERE (((m_Matter.AdministrationID)='" + AdministrationCd + "') "
                        + " AND ((m_Matter.ActionplanID)='" + ActionPlanCd + "')"
                        + " AND ((m_Matter.MatterID)='" + MatterCd + "')"
                        + " AND ((m_Matter.DeleteFlg) Is Null));"
            MrecordSet = database.Execute(myMatterSql);
            //alert(myMatterSql);
            //console.log(myMatterSql);
            var MatterName = MrecordSet(3);
            //�Č�����v����ꍇ�͍s���v�敔���̃Z��������
            if (Mcd == beforeMcd) {
                var HTML2 = '<td rowspan = "2" ></td>';
            } else {
                var HTML2 = '<span id="ActionPlan' + counter + '">' + MatterName + '</span>';
            }
            cell3.innerHTML = HTML2;
            MrecordSet.Close();
            MrecordSet = null;
            //�Č�ID��r�p
            var beforeMcd = Mcd;
            //�����/���_�����̏���
            var HTML5 = '<span id="Nextwork' + counter + '"><textarea name="txtNextWork' + counter + '" id="txtNextWork' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  rows="4" cols="30"><\/textarea></span>'
            cell6.innerHTML = HTML5;
            //�����R�[�h
            recordSet.MoveNext();
            counter++;
        }
        recordSet.Close();
        recordSet = null;
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
//* �񍐓��`�F�b�N
//*
function ChckDate(Reportday) {
    if (Reportday) {
    } else {
        txtReportdayF = document.getElementById("txtReportdayF");
        alert("�񍐓��͕K�{�ł��B");
        txtReportdayF.focus();
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
//* ��{���j�A�s���v��A�Č��̕����񕪊��p
//*
function StringSeparator(objString) {
    var sobj = objString;
    var separator = "-";
    var allayworkCd = sobj.split(separator);
    var robj = allayworkCd[1];
    return robj;
}

//*
//* �e�[�u���̖��ו������폜����B
//*
//�Q�ƁFhttp://www.yscjp.com/doc/table1.html
//
function TableClear() {
    var targetTable = document.getElementById('table1');
    var allCount = targetTable.rows.length;
    var headerCount = 1;
    var footerCount = 0;
    if (targetTable.tHead) {
        headerCount = targetTable.tHead.rows.length;
    }
    for (var i = headerCount; i < allCount; i++) {
        targetTable.deleteRow(headerCount);
    }
}

//*
//* �������t���Z�b�g����
//*
function DayCalculate(TargetDay) {
    //���ԍ������߂Ď��ԁA���P�ʂɕϊ�����B
    var tD = Date.parse(TargetDay);
    var after = 1;                             //1�����Z����B
    after = after * 24 * 60 * 60 * 1000;     //���Z�����~���b�֕ϊ�
    var wkTime = new Date(tD + after);
    var txtdate = new DateFormat("yyyy/MM/dd");
    var rtnDate = txtdate.format(new Date(wkTime));
    var rtn = rtnDate;
    return rtn;
}

//*****************************************************************************
//
// �f�[�^�ۑ��֘A
//
//******************************************************************************

//*
//*  ����EXCEL�Ƀf�[�^�ۑ�
//*
//*�@�Q��URL:http://www.h4.dion.ne.jp/~unkai/js/js04.html
//*          http://blog.livedoor.jp/takaaki_bb/archives/50012393.html
//*          http://www.tagindex.com/kakolog/q4bbs/1501/1801.html
//*

function toExcel() {
    try {
        var ExcelApp = new ActiveXObject("Excel.Application");
        var xlsFileName = document.getElementById("selectFile").value;
        var rtn = checkFilePath(xlsFileName);
        if (rtn == true) {
            //EXCEL�I�[�v��
            var workbook = ExcelApp.Workbooks.Open(xlsFileName);
            ExcelApp.Visible = false;
            ExcelApp.DisplayAlerts = false;
            ExcelApp.EnableEvents = false;
            //�ŏI�V�[�g�擾
            var SheetName = "";
            var SheetCnt = "";
            for (var i = 0; i < workbook.Worksheets.Count; i++) {
                SheetName = workbook.Worksheets.Item(i + 1).Name;
                SheetCnt = i + 1;
            }
            var wSheet = workbook.Worksheets(SheetCnt);
            //�V�[�g��Active�ɂ���B
            wSheet.Activate;
            //�o�̓t�H�[�}�b�g����p(�Z���̊i�[�ʒu���擾����)-
            var tpColumn;
            var trColumn;
            var tnColumn;
            var headerRow = 4;  //�^�C�g���s
            for (var exColum = 1, exlen = 11; exColum < exlen; exColum++) {
                var ActplanCell = wSheet.Cells(headerRow, exColum).Value;
                if (ActplanCell == "�Z���ڕW" || ActplanCell == "���ʂ̉ۑ�") {
                    tpColumn = exColum;
                }

                if (ActplanCell == "���{���e" || ActplanCell == "���{�������e" || ActplanCell == "�������{������Ɠ��e") {
                    trColumn = exColum;
                }

                if (ActplanCell == "�\��/����̉ۑ�" || ActplanCell == "�����/���_" || ActplanCell == "�\��/�ۑ�") {
                    tnColumn = exColum;
                }
            }
            //���ݓ�����������(�Z���ڕW��C��ɂ���ꍇ�̃P�[�X)
            if (tpColumn == 3) {
                var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
                var OperateDate = dateFormat.format(new Date());
                wSheet.Cells(1, 8).Value = OperateDate;
            }
            //�\����ʂ���EXCEL�ւ̏o��
            var tbl = document.getElementById("table1");
            var rows = tbl.rows;
            var excel_i = 5;
            var excel_j = 1;
            var webNo;
            var arr_excelNo = new Array();
            var arr_repDetail = new Array();    //�������{������Ɠ��e
            var arr_nxpDetail = new Array();    //�\��A����̉ۑ�
            var arr_exchckF = new Array();
            //�����L�[���[�h(���ڒǉ����͒ǋL���K�v)
            var target_outp = ["�O�o�F", "�o���F", "�x�ɁF"];
            var target_visitor = "���q�F";
            var oflg = "�O�o��";
            var vflg = "���K��";

            var excluNo = 0;
            var webNNo = 1;     //No
            var webRepNo = 4;   //�������{������Ɠ��e
            var webTskNo = 3;   //�Z���ڕW
            var webNxpNo = 5;   //�\��A����̉ۑ�

            //��ʕ\������No���擾����B
            for (var i = 1, len = rows.length; i < len; i++) {
                arr_exchckF[i] = document.getElementById('excluF' + i).checked;
                //�o�͏��O�Ƀ`�F�b�N���t���Ă���ꍇ�͏o�͏��O
                if (arr_exchckF[i] == false) {
                    var webNo = rows[i].cells[webNNo].innerText;
                    arr_repDetail[i] = rows[i].cells[webRepNo].innerText;
                    arr_nxpDetail[i] = rows[i].cells[webNxpNo].innerText;
                    var taskPlan = "";
                    var todayReport = "";
                    var nextPlan = "";
                    var excelCnt = 0;
                    var exOutRow = 0;
                    var exVisRow = 0;
                    var exVisCol = 0;
                    //EXCEL���̍s��NO���m�F����Web��No�ƈ�v�����珑�o��(���[�v�񐔂�excelEnd�����ւ��邱�Ƃő��������邱�Ƃ��\)
                    for (var excel_i = 5, excelEnd = 200; excel_i < excelEnd; excel_i++) {
                        arr_excelNo[excelCnt] = wSheet.Cells(excel_i, 1).Value;
                        var repOutdata = arr_repDetail[i];                              //�������{������Ɠ��e
                        var nxpOutdata = arr_nxpDetail[i];                              //�\��A����̉ۑ�
                        var beftExValue = wSheet.Cells(excel_i, tpColumn).Value;        //�Z���ڕW
                        var befrExValue = wSheet.Cells(excel_i, trColumn).Value;        //�������{������Ɠ��e
                        var befnExValue = wSheet.Cells(excel_i, tnColumn).Value;        //�\��A����̉ۑ�

                        if (Number(webNo) == Number(arr_excelNo[excelCnt])) {
                            if (rows[i].cells[webTskNo].innerText != "�|") {
                                if (beftExValue === undefined) {
                                    beftExValue = "";
                                }
                                taskPlan = rows[i].cells[webTskNo].innerText + "\n" + beftExValue;
                            } else {
                                taskPlan = beftExValue;
                            }
                            if (befrExValue === undefined) {
                                befrExValue = "";
                            }
                            if (befnExValue === undefined) {
                                befnExValue = "";
                            }
                            //�O�o�Ɨ��q�o�͎��̐���
                            if (repOutdata.indexOf(target_outp[0]) !== -1 || repOutdata.indexOf(target_outp[1]) !== -1 || repOutdata.indexOf(target_outp[2]) !== -1 || repOutdata.indexOf(target_visitor) !== -1) {
                                repOutdata = "";
                            }
                            todayReport = repOutdata + "\n" + befrExValue;
                            nextPlan = nxpOutdata + "\n" + befnExValue;
                        }
                        if (Number(webNo) != Number(arr_excelNo[excelCnt])) {
                            taskPlan = beftExValue;
                            todayReport = befrExValue;
                            nextPlan = befnExValue;
                        }
                        //�O�o��͎w��Z���ɏo��
                        if (arr_repDetail[i].indexOf(target_outp[0]) !== -1 || arr_repDetail[i].indexOf(target_outp[1]) !== -1 || arr_repDetail[i].indexOf(target_outp[2]) !== -1) {
                            if (arr_excelNo[excelCnt] == oflg) {
                                exOutRow = excel_i + 1;
                                var befOpexcel = wSheet.Cells(exOutRow, 1).Value;
                                if (befOpexcel === undefined) {
                                    befOpexcel = "";
                                }
                                wSheet.Cells(exOutRow, 1).Value = befOpexcel + "\n" + arr_repDetail[i];
                                taskPlan = taskPlan + "";
                                nextPlan = nextPlan + "";
                            }
                        }
                        //���K�҂͎w��Z���ɏo��
                        if (arr_repDetail[i].indexOf(target_visitor) !== -1) {
                            if (arr_excelNo[excelCnt] == oflg) {
                                exVisRow = excel_i + 1;
                                for (var exColum = 1, exlen = 11; exColum < exlen; exColum++) {
                                    var ActplanCell = wSheet.Cells(exVisRow - 1, exColum).Value;
                                    if (ActplanCell == vflg) {
                                        exVisCol = exColum;
                                        var befVpexcel = wSheet.Cells(exVisRow, exVisCol).Value;
                                        if (befVpexcel === undefined) {
                                            befVpexcel = "";
                                        }
                                        wSheet.Cells(exVisRow, exVisCol).Value = befVpexcel + "\n" + arr_repDetail[i];
                                        taskPlan = taskPlan + "";
                                        nextPlan = nextPlan + "";
                                        break;
                                    }
                                }

                            }
                        }
                        wSheet.Cells(excel_i, tpColumn).Value = taskPlan;
                        wSheet.Cells(excel_i, trColumn).Value = todayReport;
                        wSheet.Cells(excel_i, tnColumn).Value = nextPlan;
                        excelCnt = excelCnt + 1;
                    }
                }
           }
            //EXCEL�ŕۑ��������擾���邽�߂̃}�N���΍��p(�Z����Active�ɂ���)
            wSheet.Range("J1:K1").Select;
            workbook.Save();
            alert("EXCEL�ɕۑ����܂����B");
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    } finally {
        workbook.Close(false); 		//�ۑ����Ȃ�
        ExcelApp.DisplayAlerts = true;
        ExcelApp.EnableEvents = true;
        ExcelApp.Quit();
        ExcelApp = null;
    }
}

//*
//* �t�@�C���p�X���`�F�b�N��EXCEL�t�@�C�����𔻒肷��
//*
//* �Q��URL:http://gelsol.sub.jp/javascript/others/001.html
//*         http://andante0727.blog81.fc2.com/blog-entry-244.html
//*         http://nazomikan.hateblo.jp/entry/20110303/1299167055
//*
function checkFilePath(FilePath) {
    var filePath = FilePath;
    var target_ex2010 = "xlsx";
    var target_ex2003 = "xls";
    //�g���q�擾
    var ext = filePath.substring(filePath.lastIndexOf(".") + 1, filePath.length);
    var strext = " " + ext + " ";
    //�g���q����
    if (ext == "") {
        alert("�t�@�C�����I������Ă��܂���B");
        return false;
    } else {
        if (strext.indexOf(" " + target_ex2003 + " ") !== -1 || strext.indexOf(" " + target_ex2010 + " ") !== -1) {
            return true;
        } else {
            alert("EXCEL�t�@�C����I�����Ă��������B");
            return false;
        }
    }
}
