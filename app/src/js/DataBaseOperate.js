//-------------------------------------------------------------------
// ����f�[�^�x�[�X����p���W���[��
//  2013/5/16  Ver1.0    Created By M.Nishimura
//
//  �@�\�FACCESS�f�[�^�x�[�X�ɐڑ����f�[�^�x�[�X������s���B
//-------------------------------------------------------------------
var database;

function dbConnect() {
    //�f�[�^�x�[�X�ɐڑ�����֐�
    database = new ActiveXObject("ADODB.Connection");
    //���L��
    database.Open("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\Users\\m-nishimura\\Documents\\�}�N���֘A\\app\\db\\DateReport.accdb");
    //�Г���
    //database.Open("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=\\\\fs2010\\99_�l�t�H���__�ȍs\\�����^��\\�l����\\�G�p\\20130515_����A�v���J��\\app\\db\\DateReport.accdb");
    //�Г����[�J����
    //database.Open("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\Users\\nishimuram\\�l����\\FS2010�ړ��p\\�G�p\\20130515_����A�v���J��\\app\\db\\DateReport.accdb");
    //�e�X�g��
    //  database.Open("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\DATA\\masaki\\���׋�\\JavaScript\\app\\DateReport.accdb");
    //  alert("�f�[�^�x�[�X�ɐڑ����܂����B");
}

function dbClose() {
    //�f�[�^�x�[�X��ؒf����֐�
    database.Close();
    database = null;
    // alert("�f�[�^�x�[�X��ؒf���܂����B");
}