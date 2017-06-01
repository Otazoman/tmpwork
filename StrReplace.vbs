'********************************************************************
'
'ファイル名置換用スクリプト
'　2017/6/1　Created By M.Nishimura
'
'********************************************************************
Option Explicit

Dim objShell
Dim wsh
Dim initPath

'フォルダ指定
'initPath = "\\192.168.95.110\情報システム部\商品部用納品率データ"
initPath = "C:"

Dim targetFolder
Set objShell = WScript.CreateObject("Shell.Application")
If Err.Number = 0 Then
    Set objFolder = objShell.BrowseForFolder(0, "対象フォルダの選択", 16, initPath)
    If Not objFolder Is Nothing Then
        targetFolder = objFolder.Items.Item.Path
    else
        WScript.Quit
    End If
Else
    WScript.Echo "エラー：" & Err.Description
End If

Dim objFileSys, objFolder, objFile
Set objFileSys = WScript.CreateObject("Scripting.FileSystemObject")
Set objFolder = objFileSys.GetFolder(targetFolder)

Dim targetStr, replaceStr
targetStr = InputBox("置換対象文字を入力してください。", "置換対象")
replaceStr = InputBox("置換後の文字を入力してください。", "置換文字列")

Dim r
r = 0
r = ShowSubFolders(objFolder, targetStr, replaceStr)
WScript.Echo "変換処理終了  処理件数:" & r & "件"

'  ファイル名置換用処理
Function ShowSubFolders(ByVal Folder, ByVal targetStr, ByVal replaceStr)
    Dim i
    Dim File, Subfolder
    For Each File In Folder.Files
    If InStr(1, File.Name, targetStr) Then
        File.Name = Replace(File.Name, targetStr, replaceStr)
        i = i + 1
        With Err
              Select Case .Number
                Case 5, 52
                  WScript.Echo "ファイル名に使えない文字が指定されたので中断します。"
                  Exit For
                Case 58
                  WScript.Echo objFile.Name & " は既に存在するためファイル名を変更できません。"
                  .Clear
                Case 0
                  'エラーが発生しなかった場合は何もしない
                Case Else
                  WScript.Echo .Description & .Number
                  .Clear
              End Select
        End With
    End If
    Next
    '再帰処理でサブフォルダも変換
    Dim r,s
    For Each Subfolder In Folder.SubFolders
        r = ShowSubFolders(Subfolder, targetStr, replaceStr)
	s = s + r
    Next
    ShowSubFolders = i + s
End Function
