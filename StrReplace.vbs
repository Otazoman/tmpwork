'********************************************************************
'
'�t�@�C�����u���p�X�N���v�g
'�@2017/6/1�@Created By M.Nishimura
'
'********************************************************************
Option Explicit

Dim objShell
Dim wsh
Dim initPath

'�t�H���_�w��
'initPath = "\\192.168.95.110\���V�X�e����\���i���p�[�i���f�[�^"
initPath = "C:"

Dim targetFolder
Set objShell = WScript.CreateObject("Shell.Application")
If Err.Number = 0 Then
    Set objFolder = objShell.BrowseForFolder(0, "�Ώۃt�H���_�̑I��", 16, initPath)
    If Not objFolder Is Nothing Then
        targetFolder = objFolder.Items.Item.Path
    else
        WScript.Quit
    End If
Else
    WScript.Echo "�G���[�F" & Err.Description
End If

Dim objFileSys, objFolder, objFile
Set objFileSys = WScript.CreateObject("Scripting.FileSystemObject")
Set objFolder = objFileSys.GetFolder(targetFolder)

Dim targetStr, replaceStr
targetStr = InputBox("�u���Ώە�������͂��Ă��������B", "�u���Ώ�")
replaceStr = InputBox("�u����̕�������͂��Ă��������B", "�u��������")

Dim r
r = 0
r = ShowSubFolders(objFolder, targetStr, replaceStr)
WScript.Echo "�ϊ������I��  ��������:" & r & "��"

'  �t�@�C�����u���p����
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
                  WScript.Echo "�t�@�C�����Ɏg���Ȃ��������w�肳�ꂽ�̂Œ��f���܂��B"
                  Exit For
                Case 58
                  WScript.Echo objFile.Name & " �͊��ɑ��݂��邽�߃t�@�C������ύX�ł��܂���B"
                  .Clear
                Case 0
                  '�G���[���������Ȃ������ꍇ�͉������Ȃ�
                Case Else
                  WScript.Echo .Description & .Number
                  .Clear
              End Select
        End With
    End If
    Next
    '�ċA�����ŃT�u�t�H���_���ϊ�
    Dim r,s
    For Each Subfolder In Folder.SubFolders
        r = ShowSubFolders(Subfolder, targetStr, replaceStr)
	s = s + r
    Next
    ShowSubFolders = i + s
End Function
