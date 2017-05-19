//-------------------------------------------------------------------
// 基本方針登録用モジュール
//  2013/5/24  Ver1.0    Created By M.Nishimura
//
//  機能：基本方針マスタ(全社方針)登録画面制御等を行う
//-------------------------------------------------------------------
// 追加ボタン押下時に画面要素を追加する。
// 
// 参照元：http://vkgtaro.jp/2007/10/28/000618
//	   http://www.abe-tatsuya.com/web_prog/javascript/add_table_rows.php
//	   http://www.cozzbox.com/wordpress/archives/545
//
onload = init;
onunload = dbClose;
var ItemField = {
    //div要素の中で最大のitemNOを取得してcurrentNumberにセットする。
    //参照元：　http://d.hatena.ne.jp/MAXIMUM-PRO/20101013/1286960457
    //		http://wildcat.cocolog-nifty.com/web/2006/06/javascript_af76.html
    //		
    currentNumber: 0,
    itemTemplate: '基本方針ID　:<input type="text" name="txtAdministrationCd__count__" id="txtAdministrationCd__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="" \/>' + '基本方針内容:<input type="text" name="txtAdministrationDetail__count__" id="txtAdministrationDetail__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="" \/>' + '補足説明　　:<input type="text" name="txtAdministrationMemo__count__" id="txtAdministrationMemo__count__" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="" \/>' + '<input type="button" name="btnInsert__count__" id="btnInsert__count__" value="登録" onclick="dataInsert(txtAdministrationCd__count__.value,txtAdministrationDetail__count__.value,txtAdministrationMemo__count__.value,__count__)" \/>' + '<input type="button" name="btnUpdate__count__" id="btnUpdate__count__" value="更新" onclick="dataUpdate(txtAdministrationCd__count__.value,txtAdministrationDetail__count__.value,txtAdministrationMemo__count__.value,__count__)" \/>' + '<input type="button" name="btnDelete__count__" id="btnDelete__count__" value="削除" onclick="dataDelete(txtAdministrationCd__count__.value,__count__)" \/>',
    add: function() {
        //テキストボックスの最後の要素番号取得
        var eleNumber = document.getElementsByTagName("div").length - 1;
        this.currentNumber = eleNumber;
        //テキストフィールド追加
        this.currentNumber++;
        var field = document.getElementById('item' + this.currentNumber);
        var newItem = this.itemTemplate.replace(/__count__/mg, this.currentNumber);
        field.innerHTML = newItem;
        var nextNumber = this.currentNumber + 1;
        var new_area = document.createElement("div");
        new_area.setAttribute("id", "item" + nextNumber);
        field.appendChild(new_area);
        //テキストボックス追加時に基本方針IDにフォーカス
        var nxtfield = document.getElementById('txtAdministrationCd' + this.currentNumber);
        //最新テキストボックスにテキストボックスに表示されているID+1の値を表示する。
        nxtfield.value = this.currentNumber;
        nxtfield.focus();
    },
    remove: function() {
        var chkCdTxtbox = document.getElementById('txtAdministrationCd' + this.currentNumber);
        var chkDeTxtbox = document.getElementById('txtAdministrationDetail' + this.currentNumber);
        if (this.currentNumber == 0) {
            return;
        }
        //入力データ存在時はテキストボックス削除不可
        if (chkCdTxtbox.value == "" && chkDeTxtbox.value == '') {
            //テキストフィールド削除
            var field = document.getElementById('item' + this.currentNumber);
            field.removeChild(field.lastChild);
            field.innerHTML = '';
            this.currentNumber--;
            //テキストボックス削除時に基本方針IDにフォーカス
            var beforefield = document.getElementById('txtAdministrationCd' + this.currentNumber);
            if (this.currentNumber == 0) {
                return;
            } //最終行除外
            beforefield.focus();
        } else {
            alert("入力データが存在します");
            var currentfield = document.getElementById('txtAdministrationCd' + this.currentNumber);
            currentfield.focus();
        }
    },
    clear: function() {
        var clNumber = document.getElementsByTagName("div").length - 1;
        this.currentNumber = clNumber;
        var clfield = document.getElementById('item' + this.currentNumber);
        clfield.removeChild(clfield.lastChild);
        clfield.innerHTML = '';
        this.currentNumber--;
        var clfield = document.getElementById('item' + this.currentNumber);
        if (this.currentNumber == 0) {
            return;
        } //最終行除外
        clfield.removeChild(clfield.lastChild);
    }
}

function init() {
    //初期設定をする関数
    resizeTo(1000, 640);
    document.getElementById("linkLogOut").onclick = function() {
        OperateEnd();
    }
    dbConnect(); //データベース接続
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //登録用日時取得
    OperateDate = dateFormat.format(new Date());
    // データベースからレコード数を取得し必要な数量のテキストボックスを表示して値を表示する
    businessyearDisplay()
    defaultselect();
    dataDisplay();
    ItemField.add();
}

function OperateEnd() {
    //終了処理
    dbClose();
    (window.open('', '_self').opener = window).close();
}
//*****************************************************************************
//
// データ操作関連
//
//******************************************************************************

function dataCount() {
    //期の基本方針件数カウント
    var mySql = "SELECT COUNT (AdministrationID) AS IDCount FROM m_Administration WHERE DeleteFlg Is Null AND Businessyear = " + Number(selectYear.value);
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
    return idcount;
}

function dataDisplay() {
    try {
        //データを表示する関数
        var mySql = "SELECT * FROM m_Administration WHERE ( DeleteFlg Is Null) AND Businessyear = " + Number(selectYear.value) + " ORDER BY AdministrationID";
        var recordSet = database.Execute(mySql);
        var counter = 1;
        var tempHtml = "";
        while (!recordSet.EOF) {
            tempHtml = '基本方針ID　:<input type="text" name="txtAdministrationCd' + counter + '" id="txtAdministrationCd' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(0) + '" \/>' + '基本方針内容:<input type="text" name="txtAdministrationDetail' + counter + '" id="txtAdministrationDetail' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="' + recordSet(1) + '" \/>' + '補足説明　　:<input type="text" name="txtAdministrationMemo' + counter + '" id="txtAdministrationMemo' + counter + '" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'" value="' + recordSet(2) + '" \/>' + '<input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="登録" onclick="dataInsert(txtAdministrationCd' + counter + '.value,txtAdministrationDetail' + counter + '.value,txtAdministrationMemo' + counter + '.value,' + counter + ')" \/>' + '<input type="button" name="btnUpdate' + counter + '" id="btnUpdate' + counter + '" value="更新" onclick="dataUpdate(txtAdministrationCd' + counter + '.value,txtAdministrationDetail' + counter + '.value,txtAdministrationMemo' + counter + '.value,' + counter + ')" \/>' + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="削除" onclick="dataDelete(txtAdministrationCd' + counter + '.value,' + counter + ')" \/>';
            var field = document.getElementById('item' + counter);
            var newItem = tempHtml;
            field.innerHTML = newItem;
            var nextNumber = counter + 1;
            var new_area = document.createElement("div");
            new_area.setAttribute("id", "item" + nextNumber);
            field.appendChild(new_area);
            recordSet.MoveNext();
            counter++;
        }
        recordSet.Close();
        recordSet = null;
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataInsert(AdministrationCd, AdministrationDetail, AdministrationMemo, txtCount) {
    //  //データを追加する関数
    try {
        var Chkcount = txtCount;
        if (dataCheck(AdministrationCd, 0, Chkcount) && dataCheck(AdministrationDetail, 1, Chkcount)) {
            var mySql = "INSERT INTO m_Administration ( AdministrationID ,AdministrationDetail ,AdministrationMemo , Creationdate , Businessyear ) VALUES(" + "'" + AdministrationCd + "','" + AdministrationDetail + "','" + AdministrationMemo + "','" + OperateDate + "'," + Number(selectYear.value) + ");"
            //      alert(mySql);
            database.Execute(mySql);
            alert("追加しました。");
            ItemField.add();
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataUpdate(AdministrationCd, AdministrationDetail, AdministrationMemo, txtCount) {
    //データを更新する関数
    try {
        var Chkcount = txtCount;
        if (dataCheck(AdministrationCd, 0, Chkcount) && dataCheck(AdministrationDetail, 1, Chkcount)) {
            var mySql = "UPDATE m_Administration SET AdministrationDetail ='" + AdministrationDetail + "', AdministrationMemo = '" + AdministrationMemo + "', UpdateDate = '" + OperateDate + "' WHERE AdministrationID = '" + AdministrationCd + "' AND Businessyear = " + Number(selectYear.value) + ";"
            //      alert(mySql);
            database.Execute(mySql);
            dataDisplay();
            alert("更新しました。");
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function dataDelete(AdministrationCd, txtCount) {
    //  //データを削除する関数
    try {
        var Chkcount = txtCount;
        if (dataCheck(AdministrationCd, 0, Chkcount)) {
            var mySql = " UPDATE m_Administration SET DeleteFlg = '1', DeleteDate = '" + OperateDate + "' WHERE AdministrationID = '" + AdministrationCd + "' AND Businessyear = " + Number(selectYear.value);
            //      alert(mySql);
            database.Execute(mySql);
            alert("削除しました。");
            ItemField.clear()
            dataDisplay();
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

function businessyearDisplay() {
    //期をセレクトボックスに表示する関数
    var mySql = "SELECT BusinessYear FROM m_Businessyear WHERE (m_Businessyear.ShowFlg = '0') ORDER BY BusinessYear";
    var recordSet = database.Execute(mySql);
    document.getElementById("businessyearDisplay").innerHTML = "";
    var tempHtml = "期：　<select name=\"selectyear\" id=\"selectYear\">\n";
    tempHtml = tempHtml + "\t<option value=\"0\">選択してください。</option>\n";
    while (!recordSet.EOF) {
        tempHtml = tempHtml + "\t<option value=\"" + recordSet(0) + "\">" + recordSet(0) + "</option>\n";
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + "</select>";
    //	alert(tempHtml);
    document.getElementById("businessyearDisplay").innerHTML = tempHtml;
    selectYear = document.getElementById("selectYear");
    selectYear.onchange = function() {
        businessyearchange(this);
    }
    recordSet.Close();
    recordSet = null;
}

function businessyearchange(obj) {
    //セレクトボックス更新時の画面制御
    if (obj.selectedIndex == 0) {
        alert("期を選択してください。");
        var selyear = document.getElementById("selectYear");
        selyear.focus();
        return;
    }
    var counter = dataCount();
    if (counter == 0) {
        //		//0件の場合は画面をクリアする。
        var clfield = document.getElementById('item1');
        clfield.removeChild(clfield.lastChild);
        clfield.innerHTML = '';
        dataDisplay();
        ItemField.add();
    } else {
        dataDisplay();
    }
}

function defaultselect() {
    //セレクトボックスにデフォルト値をセットする。
    //  参照元　http://www.artemis.ac/contents/javascript/javascript11.htm
    //          http://www.pori2.net/js/form/5.html
    //
    var selcounter = document.getElementsByTagName("option").length - 1
    var selyearop = document.getElementById("selectYear");
    selyearop.options[selcounter].selected = true;
}
//*****************************************************************************
//
// エラーチェック関連
//
//******************************************************************************

function dataCheck(CheckValue, Chckflg, Chkcount) {
    //データをチェックする関数
    var focucCnt = Chkcount;
    var tempStr = "は必ず入力してください。";
    var txtCd = document.getElementById('txtAdministrationCd' + Chkcount);
    var txtDetail = document.getElementById('txtAdministrationDetail' + Chkcount);
    if (Chckflg == 0 && CheckValue == "") {
        alert("基本方針ID" + tempStr);
        txtCd.focus();
        return false;
    }
    if (Chckflg == 1 && CheckValue == "") {
        alert("基本方針内容" + tempStr);
        txtDetail.focus();
        return false;
    }
    return true;
}