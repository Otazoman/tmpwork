Const vbHide = 0             'ウィンドウを非表示
Const vbNormalFocus = 1      '通常のウィンドウで、最前面のウィンドウ
Const vbMinimizedFocus = 2   '最小化で、最前面のウィンドウ
Const vbMaximizedFocus = 3   '最大化で、最前面のウィンドウ
Const vbNormalNoFocus = 4    '通常のウィンドウで、最前面ではない
Const vbMinimizedNoFocus = 6 '最小化で、最前面にはならない

Set objWShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")
strCudir = objWShell.CurrentDirectory
strPath = "\\192.168.95.110\share\本社\infosystem\pc_info\"
If Not FSO.FolderExists(strPath) Then 
   strPath = strCudir & "\"
End If

pcViewini = strCudir & "\tool\PCView.ini"

If Not FSO.FileExists(pcViewini) Then 
   WScript.Quit
End If

'フォルダに接続不可の場合はカレントディレクトリにファイルを保存する。
ForReading = 1
ForWriteing = 2
Set objTextFile = FSO.OpenTextFile(pcViewini, ForReading)
Do Until objTextFile.AtEndOfStream 
    strNextLine = objTextFile.Readline 
    intLineFinder = InStr(strNextLine, "SavePath")
    If intLineFinder <> 0 Then 
        strNextLine = "SavePath=" & strPath
    End If 
    strNewFile = strNewFile & strNextLine & vbCrLf
Loop
objTextFile.Close 

Set objTextFile = FSO.OpenTextFile(pcViewini, ForWriteing)
 
objTextFile.WriteLine strNewFile
objTextFile.Close


'PCViewを起動する
runApp = strCudir & "\tool\PCView.exe"
objWShell.Run runApp

'複数IP取得(レジストリキーにvfipcfgの設定がある場合のみ起動させる)
strKeyPath = "HKEY_LOCAL_MACHINE\SOFTWARE\valhell\Valhell Ip Config\"
On Error Resume Next
If IsNull(objWShell.regread(strKeyPath)) Then
   WScript.Echo "完了しました。"
   WScript.Quit
Else
    runScripts = strCudir & "\tool\vipcfgGet.vbs"
    objWShell.Run runScripts,vbMinimizedNoFocus,false
End If
Set objWShell = Nothing

WScript.Echo "完了しました。"
