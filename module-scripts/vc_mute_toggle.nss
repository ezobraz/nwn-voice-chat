#include "nw_inc_nui"
#include "nw_inc_nui_insp"

void main()
{
    // HandleWindowInspectorEvent();

    object oPlayer = NuiGetEventPlayer();
    int    nToken  = NuiGetEventWindow();
    string sEvent  = NuiGetEventType();
    string sElem   = NuiGetEventElement();
    int    nIdx    = NuiGetEventArrayIndex();
    string sWndId  = NuiGetWindowId(oPlayer, nToken);

    if (sWndId == "voicechat") {
        if (sEvent == "click") {
            int on = GetLocalInt(oPlayer, "on");

            if (on == 1) {
                on = 0;
                NuiSetBind(oPlayer, nToken, "btnmictext", JsonString("Off"));
            } else {
                on = 1;
                NuiSetBind(oPlayer, nToken, "btnmictext", JsonString("On"));
            }

            SetLocalInt(oPlayer, "on", on);
        }
    }
}