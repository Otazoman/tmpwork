Const HKEY_LOCAL_MACHINE = &H80000002
strComputer = "."
const REG_SZ = 1
const REG_EXPAND_SZ = 2
const REG_BINARY = 3
const REG_DWORD = 4
const REG_MULTI_SZ = 7

'�ǎ�肽���L�[�̃p�X�w��
strOriginalKeyPath = "SOFTWARE\valhell\Valhell Ip Config"

'���W�X�g���l�擾�֐��ďo
strOutDate = Now() & vbCrLf
exportCSV(strOutDate)
FindKeyValue(strOriginalKeyPath)

'-------------------------------------------------------------------------
'   ���W�X�g���L�[���ċA�I�Ɏ擾����B
'-------------------------------------------------------------------------
Function FindKeyValue(strKeyPath)
    
    Set oReg=GetObject("winmgmts:{impersonationLevel=impersonate}!\\" &_
    strComputer & "\root\default:StdRegProv")
    errorCheck = oReg.EnumKey(HKEY_LOCAL_MACHINE, strKeyPath, arrSubKeys)

    If (errorCheck=0 and IsArray(arrSubKeys)) then
        For Each subkey In arrSubKeys
            strExporttxt = subKey & vbCrLf
            exportCSV(strExporttxt)
            strNewKeyPath = strKeyPath & "\" & subkey
            FindKeyValue(strNewKeyPath)
        Next
    End If

    oReg.EnumValues HKEY_LOCAL_MACHINE, strKeyPath, arrValueNames, arrValueTypes

    If (errorCheck=0 and IsArray(arrValueNames)) then
        For i=0 To UBound(arrValueNames)
          '�L�[�����擾����B
          strValueName = arrValueNames(i)
          '�ċA�I�Ɏ擾�����l���o�͂���
          Select Case arrValueTypes(i)
                  Case REG_SZ
                      oReg.GetStringValue HKEY_LOCAL_MACHINE,strKeyPath,strValueName,strValue
                      strOrec = strOrec & arrValueNames(i) & "," & strvalue & vbCrLf
                  Case REG_EXPAND_SZ
                      oReg.GetExpandedStringValue HKEY_LOCAL_MACHINE,strKeyPath,strValueName,strEXValue
                      strOrec = strOrec & arrValueNames(i) & "," & strExvalue & vbCrLf
                  Case REG_BINARY
                      oReg.GetBinaryValue HKEY_LOCAL_MACHINE,strKeyPath,strValueName,arrBytes
                      strBytes = ""
                      For Each uByte in arrBytes
                        strBytes = strBytes & Hex(uByte) & " "
                      Next
                      strOrec = strOrec & arrValueNames(i) & "," & strBytes & vbCrLf
                  Case REG_DWORD
                      oReg.GetDWORDValue HKEY_LOCAL_MACHINE,strKeyPath,strValueName,dwValue
                      strOrec = strOrec & arrValueNames(i) & "," & Cstr(dwvalue) & vbCrLf
                  Case REG_MULTI_SZ
                      oReg.GetMultiStringValue HKEY_LOCAL_MACHINE,strKeyPath,strValueName,arrValues
                      strText = arrValueNames(i) & ","
                      For Each strValue in arrValues
                          strText = strText & "    " & strValue 
                      Next
                      strOrec = strOrec & strText & vbCrLf
          End Select
        Next
        exportCSV(strOrec)
    End if
    Set oReg = Nothing
End Function

'-------------------------------------------------------------------------
'   CSV�t�@�C���Ƀ��W�X�g�������o�͂���
'-------------------------------------------------------------------------
Function exportCSV(strRec)

    Set objWShell = CreateObject("WScript.Shell")
    Set objNetWork = WScript.CreateObject("WScript.Network")
    Set FSO = CreateObject("Scripting.FileSystemObject")
    PCname= objNetWork.ComputerName
    strPath = "\\192.168.95.110\share\�{��\infosystem\pc_info\"
    '�l�b�g���[�N�ڑ��ł��Ă��Ȃ��ꍇ�̓J�����g�f�B���N�g���Ƀt�@�C����ۑ�����
    If Not FSO.FolderExists(strPath) Then 
       strPath = objWShell.CurrentDirectory & "\"
    End If
    strFileName = strPath & PCname & "_reg.csv"

    Set oLog = FSO.OpenTextFile(strFileName,8,true)
    oLog.Write(strRec)
    oLog.Close()
    Set oLog = Nothing
    Set FSO = Nothing

End Function