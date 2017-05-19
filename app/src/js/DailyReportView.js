//-------------------------------------------------------------------
// 日報表示用モジュール
//  2013/6/24  Ver1.0    Created By M.Nishimura
//  2013/7/18  Ver1.1    EXCEL日報への出力機能追加
//　2013/9/17　Ver1.2　　 出力除外フラグ追加
//  2013/12/4  Ver1.3    予定入力機能追加
//  2017/5/19 Ver1.4     リファクタリング(社員コード部分の外部化)
//
//  機能：日報登録画面で登録した日報の表示を行う
//-------------------------------------------------------------------

var EmpCd=location.search.substring(1);     //ログイン画面から担当者CD取得

onload = init;
onunload = dbClose;

//*
//*　初期設定をする関数
//*
function init() {
    //報告日(自)表示
    txtReportdayF = document.getElementById("txtReportdayF");
    var txtdate = new DateFormat("yyyy/MM/dd");
    txtdate = txtdate.format(new Date());
    txtReportdayF.value = txtdate;
    //報告日(至)表示
    txtReportdayT = document.getElementById("txtReportdayT");
    var txtdate = new DateFormat("yyyy/MM/dd");
    txtdate = txtdate.format(new Date());
    var NextDay = DayCalculate(txtdate);
    txtReportdayT.value = NextDay;
    //検索日のテキストボックス制御
    txtReportdayF.onblur = function () {
        this.style.backgroundColor = "#ffffff";
    }
    txtReportdayT.onblur = function () {
        this.style.backgroundColor = "#ffffff";
    }
    //日報検索ボタン制御
    document.getElementById("btnDaySearch").onclick = function () {
        txtDateUpdate(txtReportdayF);
    }
    //EXCEL保存ボタン制御
    document.getElementById("btnToExcel").onclick = function () {
           toExcel();
    }
    dbConnect(); //データベース接続
    // 担当者をセットして画面の初期表示
    EmpCdisplay(EmpCd);
    DisPlayChecker();
}

//*
//*　終了処理
//*
function OperateEnd() {
    dbClose();
    (window.open('', '_self').opener = window).close();
}

//*
//*　報告日更新時の処理
//*
function txtDateUpdate(obj) {
    DisPlayChecker();
    obj.style.backgroundColor = "#ffffff";
}

//*****************************************************************************
//
// データ操作関連
//
//******************************************************************************

//*
//*　報告日に日報登録が存在するかを判別して表示する関数
//*
function DisPlayChecker() {
    //報告日チェック
    var ReportdayF = document.getElementById('txtReportdayF').value;
    var ReportdayT = document.getElementById('txtReportdayT').value;
    var EmpID = EmpCd;
    //報告日(自)チェック
    if (ChckDate(ReportdayF)) {
    } else {
        return;
    }
    //報告日(至)チェック
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
    //日報の登録がなければ画面をクリアする
    if (ReportCount == 0) {
        //0件の場合は画面をクリアする。
        TableClear();
    }
    //日報の登録があればデータを表示する。    
    if (ReportCount != 0) {
        TableClear();
        dataDisplay();
    }
    recordSet.Close();
    recordSet = null;
}

//*
//*　日報データを表示する関数
//*
//* 参照URL:http://www.abe-tatsuya.com/web_prog/javascript/add_table_rows.php
//*
function dataDisplay() {
    try {
        //作業計画登録なし
        var cWork = "－";
        //日報部分
        //日報部分
        var ReportdayF = document.getElementById('txtReportdayF').value;
        var ReportdayT = document.getElementById('txtReportdayT').value;
        ChckDate(ReportdayF);
        //検索日(至)が空欄時は9999/12/31をセット
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
            //テーブル設定用
            var table1 = document.getElementById("table1");
            var row1 = table1.insertRow(counter);
            var cell1 = row1.insertCell(0);
            var cell2 = row1.insertCell(1);
            var cell3 = row1.insertCell(2);
            var cell4 = row1.insertCell(3);
            var cell5 = row1.insertCell(4);
            var cell6 = row1.insertCell(5);
            // class の付与は UserAgent によって
            // 挙動が違うっぽいので念のため両方の方法で
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
            //■NOと今日実施した作業内容表示：日報テーブルから登録されているレコードを取得
            var ReportId = recordSet(0);
            var workPlanID = recordSet(1);
            var Mcd = Number(recordSet(2)) + '-' + Number(recordSet(3)) + '-' + Number(recordSet(4));
            var MatterCd = Number(recordSet(2))+recordSet(3)+recordSet(4);
            var Tcd = recordSet(5);
            var ReportMemo = recordSet(7);
            var TaskHour = recordSet(8);
            var Reference = recordSet(9);
            var Reportday = recordSet(10)
            //日報内の日付
            var tD = Date.parse(recordSet(6));
            var wkTime = new Date(tD);
            var bodydate = new DateFormat("M/d");
            bodydate = bodydate.format(wkTime);
            //除外フラグ Added 2013/9/17
            var HTML0 = '<input id ="excluF' + counter + '" type ="checkbox" value = "exclude_' + counter + '">';
            cell1.innerHTML = HTML0;
            //NO部分のセル表示
            var HTML1 = '<span id="ReportNo' + counter + '">'+ MatterCd + '</span>';
            cell2.innerHTML = HTML1;
            var HTML4 = '<span id ="DailyReport' + counter + '">'+ReportMemo + '</span>';
            //作業名取得
            myTaskSql = "SELECT m_Task.TaskID, m_Task.taskName "
                        + " FROM m_Task"
                        + " WHERE (((m_Task.TaskID)=" + Tcd + ") AND ((m_Task.DeleteFlg) Is Null));"
            TrecordSet = database.Execute(myTaskSql);
            var TaskName = TrecordSet(1);
            var RepHtml = '<span id="DailyReport' + counter + '">' + bodydate + " " + TaskName + "：" + '</span>' + HTML4;
            TrecordSet.Close();
            TrecordSet = null;
            cell5.innerHTML = RepHtml;
            //■短期目標表示：作業予定取得
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
                //短期目標
                var WPMemo = SubrecordSet(6);
                var HTML3 = '<span id="workPlan' + counter + '">' + bodydate + " " + WPMemo + '</span>';
                SubrecordSet.Close();
                SubrecordSet = null;
            }
            cell4.innerHTML = HTML3;
            //■行動計画/業務課題表示：案件名取得(案件ID分割後に案件名表示)
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
            //案件が一致する場合は行動計画部分のセルを結合
            if (Mcd == beforeMcd) {
                var HTML2 = '<td rowspan = "2" ></td>';
            } else {
                var HTML2 = '<span id="ActionPlan' + counter + '">' + MatterName + '</span>';
            }
            cell3.innerHTML = HTML2;
            MrecordSet.Close();
            MrecordSet = null;
            //案件ID比較用
            var beforeMcd = Mcd;
            //次作業/問題点部分の処理
            var HTML5 = '<span id="Nextwork' + counter + '"><textarea name="txtNextWork' + counter + '" id="txtNextWork' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  rows="4" cols="30"><\/textarea></span>'
            cell6.innerHTML = HTML5;
            //次レコード
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
// エラーチェック関連
//
//******************************************************************************
//*
//* 報告日チェック
//*
function ChckDate(Reportday) {
    if (Reportday) {
    } else {
        txtReportdayF = document.getElementById("txtReportdayF");
        alert("報告日は必須です。");
        txtReportdayF.focus();
        return false;
    }
    return true;
}


//*
//* 担当者コードチェック
//*
function ChckEmp(Employ) {
    if (Employ) {
    } else {
        var selEmp = document.getElementById('selectEmpId');
            alert("担当者を選択してください。");
            selEmp.focus();
            return false;
    }
    return true;
}

//*
//* 基本方針、行動計画、案件の文字列分割用
//*
function StringSeparator(objString) {
    var sobj = objString;
    var separator = "-";
    var allayworkCd = sobj.split(separator);
    var robj = allayworkCd[1];
    return robj;
}

//*
//* テーブルの明細部分を削除する。
//*
//参照：http://www.yscjp.com/doc/table1.html
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
//* 翌日日付をセットする
//*
function DayCalculate(TargetDay) {
    //時間差を求めて時間、分単位に変換する。
    var tD = Date.parse(TargetDay);
    var after = 1;                             //1日加算する。
    after = after * 24 * 60 * 60 * 1000;     //加算日をミリ秒へ変換
    var wkTime = new Date(tD + after);
    var txtdate = new DateFormat("yyyy/MM/dd");
    var rtnDate = txtdate.format(new Date(wkTime));
    var rtn = rtnDate;
    return rtn;
}

//*****************************************************************************
//
// データ保存関連
//
//******************************************************************************

//*
//*  日報EXCELにデータ保存
//*
//*　参照URL:http://www.h4.dion.ne.jp/~unkai/js/js04.html
//*          http://blog.livedoor.jp/takaaki_bb/archives/50012393.html
//*          http://www.tagindex.com/kakolog/q4bbs/1501/1801.html
//*

function toExcel() {
    try {
        var ExcelApp = new ActiveXObject("Excel.Application");
        var xlsFileName = document.getElementById("selectFile").value;
        var rtn = checkFilePath(xlsFileName);
        if (rtn == true) {
            //EXCELオープン
            var workbook = ExcelApp.Workbooks.Open(xlsFileName);
            ExcelApp.Visible = false;
            ExcelApp.DisplayAlerts = false;
            ExcelApp.EnableEvents = false;
            //最終シート取得
            var SheetName = "";
            var SheetCnt = "";
            for (var i = 0; i < workbook.Worksheets.Count; i++) {
                SheetName = workbook.Worksheets.Item(i + 1).Name;
                SheetCnt = i + 1;
            }
            var wSheet = workbook.Worksheets(SheetCnt);
            //シートをActiveにする。
            wSheet.Activate;
            //出力フォーマット判定用(セルの格納位置を取得する)-
            var tpColumn;
            var trColumn;
            var tnColumn;
            var headerRow = 4;  //タイトル行
            for (var exColum = 1, exlen = 11; exColum < exlen; exColum++) {
                var ActplanCell = wSheet.Cells(headerRow, exColum).Value;
                if (ActplanCell == "短期目標" || ActplanCell == "当面の課題") {
                    tpColumn = exColum;
                }

                if (ActplanCell == "実施内容" || ActplanCell == "実施した内容" || ActplanCell == "今日実施した作業内容") {
                    trColumn = exColum;
                }

                if (ActplanCell == "予定/今後の課題" || ActplanCell == "次作業/問題点" || ActplanCell == "予定/課題") {
                    tnColumn = exColum;
                }
            }
            //現在日時を書込み(短期目標がC列にある場合のケース)
            if (tpColumn == 3) {
                var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
                var OperateDate = dateFormat.format(new Date());
                wSheet.Cells(1, 8).Value = OperateDate;
            }
            //表示画面からEXCELへの出力
            var tbl = document.getElementById("table1");
            var rows = tbl.rows;
            var excel_i = 5;
            var excel_j = 1;
            var webNo;
            var arr_excelNo = new Array();
            var arr_repDetail = new Array();    //今日実施した作業内容
            var arr_nxpDetail = new Array();    //予定、今後の課題
            var arr_exchckF = new Array();
            //検索キーワード(項目追加時は追記が必要)
            var target_outp = ["外出：", "出張：", "休暇："];
            var target_visitor = "来客：";
            var oflg = "外出先";
            var vflg = "来訪者";

            var excluNo = 0;
            var webNNo = 1;     //No
            var webRepNo = 4;   //今日実施した作業内容
            var webTskNo = 3;   //短期目標
            var webNxpNo = 5;   //予定、今後の課題

            //画面表示分のNoを取得する。
            for (var i = 1, len = rows.length; i < len; i++) {
                arr_exchckF[i] = document.getElementById('excluF' + i).checked;
                //出力除外にチェックが付いている場合は出力除外
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
                    //EXCEL内の行のNOを確認してWebのNoと一致したら書出し(ループ回数はexcelEndを書替することで増加させることが可能)
                    for (var excel_i = 5, excelEnd = 200; excel_i < excelEnd; excel_i++) {
                        arr_excelNo[excelCnt] = wSheet.Cells(excel_i, 1).Value;
                        var repOutdata = arr_repDetail[i];                              //今日実施した作業内容
                        var nxpOutdata = arr_nxpDetail[i];                              //予定、今後の課題
                        var beftExValue = wSheet.Cells(excel_i, tpColumn).Value;        //短期目標
                        var befrExValue = wSheet.Cells(excel_i, trColumn).Value;        //今日実施した作業内容
                        var befnExValue = wSheet.Cells(excel_i, tnColumn).Value;        //予定、今後の課題

                        if (Number(webNo) == Number(arr_excelNo[excelCnt])) {
                            if (rows[i].cells[webTskNo].innerText != "－") {
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
                            //外出と来客出力時の制御
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
                        //外出先は指定セルに出力
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
                        //来訪者は指定セルに出力
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
            //EXCELで保存時刻を取得するためのマクロ対策用(セルをActiveにする)
            wSheet.Range("J1:K1").Select;
            workbook.Save();
            alert("EXCELに保存しました。");
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    } finally {
        workbook.Close(false); 		//保存しない
        ExcelApp.DisplayAlerts = true;
        ExcelApp.EnableEvents = true;
        ExcelApp.Quit();
        ExcelApp = null;
    }
}

//*
//* ファイルパスをチェックしEXCELファイルかを判定する
//*
//* 参照URL:http://gelsol.sub.jp/javascript/others/001.html
//*         http://andante0727.blog81.fc2.com/blog-entry-244.html
//*         http://nazomikan.hateblo.jp/entry/20110303/1299167055
//*
function checkFilePath(FilePath) {
    var filePath = FilePath;
    var target_ex2010 = "xlsx";
    var target_ex2003 = "xls";
    //拡張子取得
    var ext = filePath.substring(filePath.lastIndexOf(".") + 1, filePath.length);
    var strext = " " + ext + " ";
    //拡張子判別
    if (ext == "") {
        alert("ファイルが選択されていません。");
        return false;
    } else {
        if (strext.indexOf(" " + target_ex2003 + " ") !== -1 || strext.indexOf(" " + target_ex2010 + " ") !== -1) {
            return true;
        } else {
            alert("EXCELファイルを選択してください。");
            return false;
        }
    }
}
