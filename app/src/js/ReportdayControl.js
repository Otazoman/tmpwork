//*--------------------------------------------------------------------------
//*
//* ������(��)��\������
//*        FromDaySet("id");
//*        ���������v�Z���ăe�L�X�g�{�b�N�X�ɃZ�b�g����B
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
//* �������t���Z�b�g����
//*         DayCalculate("yyyy/mm/dd");
//*         �����Ŏ󂯂��������t���v�Z���ĕԂ�
//*
//*--------------------------------------------------------------------------
function DayCalculate(TargetDay) {
    //���ԍ������߂Ď��ԁA���P�ʂɕϊ�����B
    var tD = Date.parse(TargetDay);
    var after = 1;                             //1�����Z����B
    after = after * 24 * 60 * 60 * 1000;       //���Z�����~���b�֕ϊ�
    var wkTime = new Date(tD + after);
    var txtdate = new DateFormat("yyyy/MM/dd");
    var rtnDate = txtdate.format(new Date(wkTime));
    var rtn = rtnDate;
    return rtn;
}

//*--------------------------------------------------------------------------
//*
//* �񍐓��`�F�b�N
//*             txtDayCheacker();
//*             �񍐓��̃e�L�X�g�{�b�N�X�̓��͓��e���`�F�b�N����B
//*
//*--------------------------------------------------------------------------
function txtDayCheacker(){
    //�񍐓��`�F�b�N
    var ReportdayF = document.getElementById('txtReportdayF');
    var ReportdayT = document.getElementById('txtReportdayT');
    var EmpID = EmpCd;
    //������(��)�`�F�b�N
    if (ChckDate(ReportdayF.value)) {
        return true;
    } else {
        return false;
    }
    //������(��)�`�F�b�N(���͂Ȃ����9999/12/31���Z�b�g����)
    if (ReportdayT.value) {
        return true;
    } else {
        ReportdayT.value = "9999/12/31";
    }
}
//���������̓`�F�b�N
function ChckDate(Reportday) {
    if (Reportday) {
    } else {
        txtReportdayF = document.getElementById("txtReportdayF");
        alert("�������͕K�{�ł��B");
        txtReportdayF.focus();
        return false;
    }
    return true;
}
