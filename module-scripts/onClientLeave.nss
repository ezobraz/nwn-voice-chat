void main()
{
    object player = GetExitingObject();

    if (!GetIsPC(player)) {
        return;
    }

    string uuid = GetObjectUUID(player);

    PrintString("left: " + uuid);
}
