export const getMicDevices = async () => {
  let rejected = false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    stream.getTracks().forEach((track) => {
      track.stop();
    });
    const deviceInfo = await navigator.mediaDevices.enumerateDevices();
    const audioInputDevices = deviceInfo.filter((item) => item.kind === "audioinput" && item.deviceId !== "default");
    const defaultDeviceGroupId = deviceInfo.find(
      (item) => item.kind === "audioinput" && item.deviceId === "default",
    )?.groupId;
    const defaultDeviceId =
      audioInputDevices.find((item) => item.groupId === defaultDeviceGroupId)?.deviceId ??
      audioInputDevices[0]?.deviceId ??
      "";
    return {
      defaultDeviceId,
      audioInputDevices,
      rejected,
    };
  } catch (error) {
    rejected = true;
  }
  return {
    defaultDeviceId: "",
    audioInputDevices: [],
    rejected,
  };
};
