//*--------------------------------------------------------------------------
//*
//* ��ʂɕ\������Ă���f�[�^��CSV�`���Ń_�E�����[�h����
//*        ViewDownload();
//*        ��ʏ�ɕ\������Ă���e�[�u����CSV�Ƃ��ăf�X�N�g�b�v�Ƀ_�E�����[�h����B
//*
//*--------------------------------------------------------------------------
//  �Q��URL:http://blog.goo.ne.jp/xmldtp/e/bdc416e4985f02f60b0399864d49fd3f
//          http://uhyohyo.net/javascript/2_8.html
//          http://write-remember.com/program/javascript/get_table/
//          http://omachizura.com/web/javascript%E3%81%A7table%E3%82%BF%E3%82%B0%E3%81%AE%E4%B8%AD%E3%81%AE%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB%E3%81%AB%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%81%99%E3%82%8B.html
//*
function ViewDownload(filename) {
    try {
        //�e�L�X�g�t�@�C�����f�X�N�g�b�v�ɕۑ�
        var fs = new ActiveXObject("Scripting.FileSystemObject");
        var outf = fs.CreateTextFile(filename, true);
       //�f�[�^�o��
       var header = document.getElementById("headder1");
        var tbl = document.getElementById("contenttable");
        // �s�ɑ΂��郋�[�v
        var rows = tbl.rows;
        var outputFile = "";
        for (var i = 0, len = rows.length; i < len; i++) {
            var cols = rows[i].cells.length;
            var conmactl = cols - 1;
            // ��ɑ΂��郋�[�v
            for (var j = 0; j < cols; j++) {
                var dlitem;
                if (i == 0){
                    //�w�b�_����
                    var dlitem = header.children[0].children[j].innerText;
                }else{
                    //�f�[�^����
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
        alert("�f�X�N�g�b�v�Ƀt�@�C����ۑ����܂����B");
        outf.Close();
    }
}

//*--------------------------------------------------------------------------
//*
//* �������ʃf�[�^��CSV�`���Ń_�E�����[�h����
//*        AllDownload(filename,headerfile,mysql,arrayConut);
//*        ��ʏ�ɕ\������Ă���e�[�u����CSV�Ƃ��ăf�X�N�g�b�v�Ƀ_�E�����[�h����B
//*
//*--------------------------------------------------------------------------
//*
//*  �S���_�E�����[�h
//*
function AllDownload(filename,headerfile,mysql,arrayConut) {
    if (window.confirm('�c�Ǝ��Ԗ��ׂ̑S���f�[�^���_�E�����[�h���܂��B\n��낵���ł����H')) {
        try {

            //console.log(mySql);


            //�e�L�X�g�t�@�C�����f�X�N�g�b�v�ɕۑ�
            var fs = new ActiveXObject("Scripting.FileSystemObject");
            var outf = fs.CreateTextFile(filename, true);
            var outputFile = "";
            //��ƌv��o�^�Ȃ�
            var cWork = "�|";
            //�^�C�g������
            outputFile = headerfile;
            var recordSet = database.Execute(mysql);
            var counter = 1;
            while (!recordSet.EOF) {
                //�c�Ǝ��Ԗ���
                for (var i = 0; i <= arrayConut; i++) {
                    //���̂܂܃��R�[�h�o��
                    if (i <= arrayConut -1 ) {
                        outputFile = outputFile + "\"" + recordSet(i) + "\"" + ",";
                    }
                    //�ŏI�J�����̏ꍇ�͉��s
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
            alert("�f�X�N�g�b�v�Ƀt�@�C����ۑ����܂����B");
            outf.Close();
        }
    } else {
        alert("�_�E�����[�h���L�����Z�����܂����B");
    }
}

//*--------------------------------------------------------------------------
//*
//* ��ʂɕ\�����ꂽ�e�[�u���̖��ׂ��N���A�ɂ���B
//*        TableClear();
//*        ��ʂɕ\������Ă���e�[�u���̖��׃f�[�^���N���A����B
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
//* �f�[�^�̌����m�F
//*        DisPlayChecker(countsql1);
//*        SQL�����Ƀ��R�[�h�������J�E���g�����ʂ�Ԃ��B
//*--------------------------------------------------------------------------
function DisPlayChecker(countsql) {
    try {
//        console.log(countsql);
        var recordSet = database.Execute(countsql);
        var recCount = recordSet(0);
        //0��
        if (recCount == 0){
            return 0;
        }
        //0���łȂ��ꍇ
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
//* �f�[�^�̕\��
//*        DataDisplay(drawsql,arryCount);
//*        SQL�����Ƀe�[�u���ɖ��׃f�[�^��`�悷��B
//*
//*--------------------------------------------------------------------------
function DataDisplay(drawsql,arryCount) {
    try {
        //console.log(drawsql);
        var recordSet = database.Execute(drawsql);
        //���R�[�h������HTML��`��
        var counter = 1;
        while (!recordSet.EOF) {
            var table1 = document.getElementById("table1");
            var row1 = table1.insertRow(counter);
            var outhtml = new Array(arryCount);
            var cellname = new Array(arryCount);
            //���ו\��
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
