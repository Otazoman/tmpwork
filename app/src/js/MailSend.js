//-------------------------------------------------------------------
// ���[�����M�p���W���[��
//  2017/5/25           Ver1.0  Created By M.Nishimura
//
//  �w�舶����󂯂ă��[���𑗐M����
//-------------------------------------------------------------------

//ToDo
//�f�[�^�x�[�X�ɃJ������ǉ����ď�i�ƕ����̑g������ă��[�����M�ł���悤�ɂ���

//�c�Ɛ\���p
function overTimeAppSendMail(EmpID,ovplanval,overtimeval,selCause,overtimeMemo,Reportday){
    var From ="hoge@hotmail.com";
    var To = "hoge@hotmail.com";
    var empName = getEmpname(EmpID)
    var ovCause = getOvertimeCause(selCause)
    var Subject = "�y"+ Reportday +"���c�Ɛ\���z�]�ƈ�CD�F"+EmpID+ " " + empName;
    var Body = "�����l�ł��B"+ empName + "�ł��B\n"
                + Reportday + "���̎c�Ƃ�\���������܂��B\n"
                +"�c�Ɨ��R�F" + ovCause + "\n"
                +"�ڍׁ@�@�F" + overtimeMemo + "\n"
                +"�\�����ԁF" + ovplanval +"\n"
                +"���ێc�Ǝ��ԁF"+ overtimeval +"\n";
    sendMail(From,To,Subject,Body)
}

//�c�ƕ񍐗p
function overTimeRepSendMail(EmpID,overtimeval,selCause,overtimeMemo,Reportday){
    var From ="hoge@hotmail.com";
    var To = "hoge@hotmail.com";
    var empName = getEmpname(EmpID)
    var ovCause = getOvertimeCause(selCause)
    var Subject = "�y"+ Reportday +"���c�Ɛ\���z�]�ƈ�CD�F"+EmpID+ " " + empName;
    var Body = "�����l�ł��B"+ empName + "�ł��B\n"
                + Reportday + "���̎c�Ɠ��e�ɕύX������܂����̂ł��񍐂������܂��B\n"
                +"�c�Ɨ��R�F" + ovCause + "\n"
                +"�ڍׁ@�@�F" + overtimeMemo + "\n"
                +"���ێc�Ǝ��ԁF"+ overtimeval +"\n";
    sendMail(From,To,Subject,Body)
}

//�]�ƈ��R�[�h���玁���������Ă���
function getEmpname(EmpID){
    var mySql = "SELECT Empid,Empname FROM m_Emp WHERE Empid='" + EmpID + "';";
    var recordSet = database.Execute(mySql);
    var str = recordSet(1);
    return str;
}

//�c�Ɨ��R�R�[�h����c�Ɨ��R�������Ă���
function getOvertimeCause(CauseID){
    var mySql = "SELECT CauseID,CauseMemo FROM m_Cause WHERE CauseID=" + CauseID
        + " AND ( DeleteFlg = '0');";
    var recordSet = database.Execute(mySql);
    var str = recordSet(1);
    return str;
}

//���[���𑗐M����
function sendMail(mailFrom,mailTo,mailSubject,mailBody){
    var cdoMsg = new ActiveXObject("CDO.Message");
    var namespace = "http://schemas.microsoft.com/cdo/configuration/";

    // ���M�֘A
    cdoMsg.From = mailFrom;
    cdoMsg.To = mailTo;

    //�����֘A
    cdoMsg.Subject = mailSubject;
    cdoMsg.Textbody = mailBody;

    //SMTP
    cdoMsg.Configuration.Fields.Item(namespace + "sendusing") = 2;
    cdoMsg.Configuration.Fields.Item(namespace + "smtpserver") = "192.168.91.23";
    cdoMsg.Configuration.Fields.Item(namespace + "smtpserverport") = 25;
    cdoMsg.Configuration.Fields.Update();

/*
    //Gmail
    cdoMsg.Configuration.Fields.Item(namespace + "sendusing") = 2;
    cdoMsg.Configuration.Fields.Item(namespace + "smtpserver") = "smtp.gmail.com";
    cdoMsg.Configuration.Fields.Item(namespace + "smtpserverport") = 465;
    cdoMsg.Configuration.Fields.Item(namespace + "smtpauthenticate") = 1;
    cdoMsg.Configuration.Fields.Item(namespace + "sendusername") = "username@gmail.com";
    cdoMsg.Configuration.Fields.Item(namespace + "sendpassword") = "password";
    cdoMsg.Configuration.Fields.Item(namespace + "smtpusessl") = true;
    cdoMsg.Configuration.Fields.Update();
*/

    cdoMsg.Send();
    cdoMsg = null;
}
