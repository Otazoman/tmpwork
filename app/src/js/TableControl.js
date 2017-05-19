//*--------------------------------------------------------------------------
//*
//* 画面に表示されているデータをCSV形式でダウンロードする
//*        ViewDownload();
//*        画面上に表示されているテーブルをCSVとしてデスクトップにダウンロードする。
//*
//*--------------------------------------------------------------------------
//  参照URL:http://blog.goo.ne.jp/xmldtp/e/bdc416e4985f02f60b0399864d49fd3f
//          http://uhyohyo.net/javascript/2_8.html
//          http://write-remember.com/program/javascript/get_table/
//          http://omachizura.com/web/javascript%E3%81%A7table%E3%82%BF%E3%82%B0%E3%81%AE%E4%B8%AD%E3%81%AE%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB%E3%81%AB%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%81%99%E3%82%8B.html
//*
function ViewDownload(filename) {
    try {
        //テキストファイルをデスクトップに保存
        var fs = new ActiveXObject("Scripting.FileSystemObject");
        var outf = fs.CreateTextFile(filename, true);
       //データ出力
       var header = document.getElementById("headder1");
        var tbl = document.getElementById("contenttable");
        // 行に対するループ
        var rows = tbl.rows;
        var outputFile = "";
        for (var i = 0, len = rows.length; i < len; i++) {
            var cols = rows[i].cells.length;
            var conmactl = cols - 1;
            // 列に対するループ
            for (var j = 0; j < cols; j++) {
                var dlitem;
                if (i == 0){
                    //ヘッダ処理
                    var dlitem = header.children[0].children[j].innerText;
                }else{
                    //データ処理
                    var dlitem = rows[i].cells[j].innerText;
                }
                outputFile = outputFile + "\"" + dlitem + "\"";
                if (j < conmactl) {
                    outputFile = outputFile + ","
                }
                if (j == conmactl) {
                    outputFile = outputFile + "\n";
                }
            }
        }
        outf.Write(outputFile);
    } catch (error) {
        alert(error.number + "\n" + error.description);
    } finally {
        alert("デスクトップにファイルを保存しました。");
        outf.Close();
    }
}

//*--------------------------------------------------------------------------
//*
//* 検索結果データをCSV形式でダウンロードする
//*        AllDownload(filename,headerfile,mysql,arrayConut);
//*        画面上に表示されているテーブルをCSVとしてデスクトップにダウンロードする。
//*
//*--------------------------------------------------------------------------
//*
//*  全件ダウンロード
//*
function AllDownload(filename,headerfile,mysql,arrayConut) {
    if (window.confirm('残業時間明細の全件データをダウンロードします。\nよろしいですか？')) {
        try {

            //console.log(mySql);


            //テキストファイルをデスクトップに保存
            var fs = new ActiveXObject("Scripting.FileSystemObject");
            var outf = fs.CreateTextFile(filename, true);
            var outputFile = "";
            //作業計画登録なし
            var cWork = "－";
            //タイトル部分
            outputFile = headerfile;
            var recordSet = database.Execute(mysql);
            var counter = 1;
            while (!recordSet.EOF) {
                //残業時間明細
                for (var i = 0; i <= arrayConut; i++) {
                    //そのままレコード出力
                    if (i <= arrayConut -1 ) {
                        outputFile = outputFile + "\"" + recordSet(i) + "\"" + ",";
                    }
                    //最終カラムの場合は改行
                    if (i == arrayConut) {
                        outputFile = outputFile + "\"" + recordSet(i) + "\"" + "\n";
                    }
                }
                recordSet.MoveNext();
                counter++;
            }
            outf.Write(outputFile);
        } catch (error) {
            alert(error.number + "\n" + error.description);
        } finally {
            recordSet.Close();
            recordSet = null;
            alert("デスクトップにファイルを保存しました。");
            outf.Close();
        }
    } else {
        alert("ダウンロードをキャンセルしました。");
    }
}

//*--------------------------------------------------------------------------
//*
//* 画面に表示されたテーブルの明細をクリアにする。
//*        TableClear();
//*        画面に表示されているテーブルの明細データをクリアする。
//*
//*--------------------------------------------------------------------------
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

//*--------------------------------------------------------------------------
//*
//* データの件数確認
//*        DisPlayChecker(countsql1);
//*        SQLを元にレコード件数をカウントし結果を返す。
//*--------------------------------------------------------------------------
function DisPlayChecker(countsql) {
    try {
//        console.log(countsql);
        var recordSet = database.Execute(countsql);
        var recCount = recordSet(0);
        //0件
        if (recCount == 0){
            return 0;
        }
        //0件でない場合
        if (recCount !=0){
            return recCount;
        }
        recordSet.Close();
        recordSet = null;
    } catch (error) {
        alert("DisPlayChecker:" + error.number + "\n" + error.description);
    }
}

//*--------------------------------------------------------------------------
//*
//* データの表示
//*        DataDisplay(drawsql,arryCount);
//*        SQLを元にテーブルに明細データを描画する。
//*
//*--------------------------------------------------------------------------
function DataDisplay(drawsql,arryCount) {
    try {
        //console.log(drawsql);
        var recordSet = database.Execute(drawsql);
        //レコード件数分HTMLを描画
        var counter = 1;
        while (!recordSet.EOF) {
            var table1 = document.getElementById("table1");
            var row1 = table1.insertRow(counter);
            var outhtml = new Array(arryCount);
            var cellname = new Array(arryCount);
            //明細表示
            for (var i = 0; i < arryCount -1; i++) {
                var classname = String('O' + i);
                cellname[i] = row1.insertCell(i);
                cellname[i].setAttribute("class", classname);
                cellname[i].className = classname;
                outhtml[i] = '<span id="' + classname + '-' + counter + '">' + recordSet(i) + '</span>';
                cellname[i].innerHTML = outhtml[i];
            }
            recordSet.MoveNext();
            counter++;
        }
        recordSet.Close();
        recordSet = null;
    } catch (error) {
        alert("DataDisplay:" + error.number + "\n" + error.description);
    }
}
