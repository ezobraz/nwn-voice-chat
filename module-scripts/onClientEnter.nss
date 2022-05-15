#include "nw_inc_nui"
#include "nw_inc_nui_insp"

string VC_URL = "localhost:3000"

string GeneratePin() {
    int p1 = Random(9);
    int p2 = Random(9);
    int p3 = Random(9);
    int p4 = Random(9);

    return IntToString(p1) +  IntToString(p2) +  IntToString(p3) +  IntToString(p4);
}

void DumpPositionData(object player, json pin, json jUUID) {
    if (!GetIsObjectValid(player)) {
        return;
    }

    vector playerPos = GetPosition(player);

    json name = JsonString(GetPCPlayerName(player));

    object area = GetArea(player);
    json loc = JsonString(GetName(area));

    json angle = JsonFloat(GetFacing(player));
    json x = JsonFloat(playerPos.x);
    json y = JsonFloat(playerPos.y);
    json z = JsonFloat(playerPos.z);
    json on = JsonInt(GetLocalInt(player, "on"));

    json a = JsonObject();
    a = JsonObjectSet(a, "pin", pin);
    a = JsonObjectSet(a, "name", name);
    a = JsonObjectSet(a, "loc", loc);
    a = JsonObjectSet(a, "angle", angle);
    a = JsonObjectSet(a, "x", x);
    a = JsonObjectSet(a, "y", y);
    a = JsonObjectSet(a, "z", z);
    a = JsonObjectSet(a, "on", on);
    a = JsonObjectSet(a, "uuid", jUUID);

    string output = JsonDump(a);

    PrintString("pos: " + output);

    DelayCommand(0.10, DumpPositionData(player, pin, jUUID));
}

void DrawGUI(object player, string pin) {
    json row = JsonArray();

    // btn
    json btnmic = NuiEnabled(NuiId(NuiButton(NuiBind("btnmictext")), "btnmic"), NuiBind("btnmute"));
    row = JsonArrayInsert(row, NuiWidth(btnmic, 40.0));

    // url & pon
    json col_content = JsonArray();
    col_content = JsonArrayInsert(
        col_content,
        JsonObjectSet(
            NuiLabel(
                JsonString(VC_URL),
                JsonInt(NUI_HALIGN_LEFT),
                JsonInt(NUI_HALIGN_LEFT)
            ),
            "text_color",
            NuiColor(255, 0, 0)
        )
    );
    col_content = JsonArrayInsert(
        col_content,
        JsonObjectSet(
            NuiLabel(
                JsonString("PIN: " + pin),
                JsonInt(NUI_HALIGN_LEFT),
                JsonInt(NUI_HALIGN_LEFT)
            ),
            "text_color",
            NuiColor(255, 0, 0)
        )
    );
    row = JsonArrayInsert(row, NuiWidth(NuiCol(col_content), 150.0));

    json root = NuiRow(row);
    json nui = NuiWindow(
        root,
        JsonString("Voice Chat"),
        NuiBind("geometry"),
        NuiBind("resizable"),
        NuiBind("collapsed"),
        NuiBind("closable"),
        NuiBind("transparent"),
        NuiBind("border")
    );

    int token = NuiCreate(player, nui, "voicechat");

    NuiSetBind(player, token, "collapsed", JsonBool(FALSE));
    NuiSetBind(player, token, "resizable", JsonBool(FALSE));
    NuiSetBind(player, token, "closable", JsonBool(FALSE));
    NuiSetBind(player, token, "transparent", JsonBool(FALSE));
    NuiSetBind(player, token, "border", JsonBool(TRUE));
    NuiSetBind(player, token, "btnmictext", JsonString("Off"));
    NuiSetBind(player, token, "btnmute", JsonBool(1));
    NuiSetBind(player, token, "geometry", NuiRect(5000.0, 500.0, 210.0, 92.0));
}

void Init() {
    object player = GetEnteringObject();

    if (!GetIsPC(player)) {
        return;
    }

    // MakeWindowInspector(player);
    SetEventScript(GetModule(), EVENT_SCRIPT_MODULE_ON_NUI_EVENT, "vc_mute_toggle");

    string pin = GeneratePin();
    json jPin = JsonString(pin);
    json jUUID = JsonString(GetObjectUUID(player));

    DrawGUI(player, pin);

    DumpPositionData(player, jPin, jUUID);
}

void main()
{
    Init();
}

