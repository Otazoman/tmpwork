//-------------------------------------------------------------------
// メール送信用モジュール
//  2017/5/25           Ver1.0  Created By M.Nishimura
//
//  指定宛先を受けてメールを送信する
//-------------------------------------------------------------------

//ToDo
//データベースにカラムを追加して上司と部下の組を作ってメール送信できるようにする

//残業申請用
function overTimeAppSendMail(EmpID,ovplanval,overtimeval,selCause,overtimeMemo,Reportday){
    var From ="hoge@hotmail.com";
    var To = "hoge@hotmail.com";
    var empName = getEmpname(EmpID)
    var ovCause = getOvertimeCause(selCause)
    var Subject = "【"+ Reportday +"分残業申請】従業員CD："+EmpID+ " " + empName;
    var Body = "お疲れ様です。"+ empName + "です。\n"
                + Reportday + "分の残業を申請いたします。\n"
                +"残業理由：" + ovCause + "\n"
                +"詳細　　：" + overtimeMemo + "\n"
                +"申請時間：" + ovplanval +"\n"
                +"実際残業時間："+ overtimeval +"\n";
    sendMail(From,To,Subject,Body)
}

//残業報告用
function overTimeRepSendMail(EmpID,overtimeval,selCause,overtimeMemo,Reportday){
    var From ="hoge@hotmail.com";
    var To = "hoge@hotmail.com";
    var empName = getEmpname(EmpID)
    var ovCause = getOvertimeCause(selCause)
    var Subject = "【"+ Reportday +"分残業申請】従業員CD："+EmpID+ " " + empName;
    var Body = "お疲れ様です。"+ empName + "です。\n"
                + Reportday + "分の残業内容に変更がありましたのでご報告いたします。\n"
                +"残業理由：" + ovCause + "\n"
                +"詳細　　：" + overtimeMemo + "\n"
                +"実際残業時間："+ overtimeval +"\n";
    sendMail(From,To,Subject,Body)
}

//従業員コードから氏名を引いてくる
function getEmpname(EmpID){
    var mySql = "SELECT Empid,Empname FROM m_Emp WHERE Empid='" + EmpID + "';";
    var recordSet = database.Execute(mySql);
    var str = recordSet(1);
    return str;
}

//残業理由コードから残業理由を引いてくる
function getOvertimeCause(CauseID){
    var mySql = "SELECT CauseID,CauseMemo FROM m_Cause WHERE CauseID=" + CauseID
        + " AND ( DeleteFlg = '0');";
    var recordSet = database.Execute(mySql);
    var str = recordSet(1);
    return str;
}

//メールを送信する
function sendMail(mailFrom,mailTo,mailSubject,mailBody){
    var cdoMsg = new ActiveXObject("CDO.Message");
    var namespace = "http://schemas.microsoft.com/cdo/configuration/";

    // 送信関連
    cdoMsg.From = mailFrom;
    cdoMsg.To = mailTo;

    //件名関連
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
