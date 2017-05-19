//*--------------------------------------------------------------------------
//*
//* 検索日(自)を表示する
//*        FromDaySet("id");
//*        月初日を計算してテキストボックスにセットする。
//*
//*--------------------------------------------------------------------------
function FromDaySet(object){
    var txtdate = new DateFormat("yyyy/MM/dd");
    txtdate = txtdate.format(new Date());
    var dy = new DateFormat("yyyy");
    var ReportYear = dy.format(new Date(txtdate));
    var dm = new DateFormat("MM");
    var ReportMonth = dm.format(new Date(txtdate));
    var txtdate = ReportYear + "/" + ReportMonth + "/" + "01";
    object.value = txtdate;
}

//*--------------------------------------------------------------------------
//*
//* 翌日日付をセットする
//*         DayCalculate("yyyy/mm/dd");
//*         引数で受けた翌日日付を計算して返す
//*
//*--------------------------------------------------------------------------
function DayCalculate(TargetDay) {
    //時間差を求めて時間、分単位に変換する。
    var tD = Date.parse(TargetDay);
    var after = 1;                             //1日加算する。
    after = after * 24 * 60 * 60 * 1000;       //加算日をミリ秒へ変換
    var wkTime = new Date(tD + after);
    var txtdate = new DateFormat("yyyy/MM/dd");
    var rtnDate = txtdate.format(new Date(wkTime));
    var rtn = rtnDate;
    return rtn;
}

//*--------------------------------------------------------------------------
//*
//* 報告日チェック
//*             txtDayCheacker();
//*             報告日のテキストボックスの入力内容をチェックする。
//*
//*--------------------------------------------------------------------------
function txtDayCheacker(){
    //報告日チェック
    var ReportdayF = document.getElementById('txtReportdayF');
    var ReportdayT = document.getElementById('txtReportdayT');
    var EmpID = EmpCd;
    //検索日(自)チェック
    if (ChckDate(ReportdayF.value)) {
        return true;
    } else {
        return false;
    }
    //検索日(至)チェック(入力なければ9999/12/31をセットする)
    if (ReportdayT.value) {
        return true;
    } else {
        ReportdayT.value = "9999/12/31";
    }
}
//検索日入力チェック
function ChckDate(Reportday) {
    if (Reportday) {
    } else {
        txtReportdayF = document.getElementById("txtReportdayF");
        alert("検索日は必須です。");
        txtReportdayF.focus();
        return false;
    }
    return true;
}
