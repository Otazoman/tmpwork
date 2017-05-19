//-------------------------------------------------------------------
// 日報データベース操作用モジュール
//  2013/5/16  Ver1.0    Created By M.Nishimura
//
//  機能：ACCESSデータベースに接続しデータベース操作を行う。
//-------------------------------------------------------------------
var database;

function dbConnect() {
    //データベースに接続する関数
    database = new ActiveXObject("ADODB.Connection");
    //共有環境
    database.Open("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\Users\\m-nishimura\\Documents\\マクロ関連\\app\\db\\DateReport.accdb");
    //社内環境
    //database.Open("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=\\\\fs2010\\99_個人フォルダ_な行\\西村真樹\\個人資料\\雑用\\20130515_日報アプリ開発\\app\\db\\DateReport.accdb");
    //社内ローカル環境
    //database.Open("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\Users\\nishimuram\\個人資料\\FS2010移動用\\雑用\\20130515_日報アプリ開発\\app\\db\\DateReport.accdb");
    //テスト環境
    //  database.Open("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\DATA\\masaki\\お勉強\\JavaScript\\app\\DateReport.accdb");
    //  alert("データベースに接続しました。");
}

function dbClose() {
    //データベースを切断する関数
    database.Close();
    database = null;
    // alert("データベースを切断しました。");
}