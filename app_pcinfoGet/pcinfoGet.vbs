Const vbHide = 0             '�E�B���h�E���\��
Const vbNormalFocus = 1      '�ʏ�̃E�B���h�E�ŁA�őO�ʂ̃E�B���h�E
Const vbMinimizedFocus = 2   '�ŏ����ŁA�őO�ʂ̃E�B���h�E
Const vbMaximizedFocus = 3   '�ő剻�ŁA�őO�ʂ̃E�B���h�E
Const vbNormalNoFocus = 4    '�ʏ�̃E�B���h�E�ŁA�őO�ʂł͂Ȃ�
Const vbMinimizedNoFocus = 6 '�ŏ����ŁA�őO�ʂɂ͂Ȃ�Ȃ�

Set objWShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")
strCudir = objWShell.CurrentDirectory
strPath = "\\192.168.95.110\share\�{��\infosystem\pc_info\"
If Not FSO.FolderExists(strPath) Then 
   strPath = strCudir & "\"
End If

pcViewini = strCudir & "\tool\PCView.ini"

If Not FSO.FileExists(pcViewini) Then 
   WScript.Quit
End If

'�t�H���_�ɐڑ��s�̏ꍇ�̓J�����g�f�B���N�g���Ƀt�@�C����ۑ�����B
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


'PCView���N������
runApp = strCudir & "\tool\PCView.exe"
objWShell.Run runApp

'����IP�擾(���W�X�g���L�[��vfipcfg�̐ݒ肪����ꍇ�̂݋N��������)
strKeyPath = "HKEY_LOCAL_MACHINE\SOFTWARE\valhell\Valhell Ip Config\"
On Error Resume Next
If IsNull(objWShell.regread(strKeyPath)) Then
   WScript.Echo "�������܂����B"
   WScript.Quit
Else
    runScripts = strCudir & "\tool\vipcfgGet.vbs"
    objWShell.Run runScripts,vbMinimizedNoFocus,false
End If
Set objWShell = Nothing

WScript.Echo "�������܂����B"
