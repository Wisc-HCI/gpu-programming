{
  function readFile(filename) {
    var fs = require("fs");

    fs.readFile(filename, function (err, data) {
      if (err) {
        return console.error(err);
      }

      text = data.toString();
      const lines = text.split("\n");
    });

    for (var line in lines) {
      var args = line.split(" ");
      switch (args[0]) {
        case "FI":
          type = "DisplayImage";
          data = {
            fields: {
              FIELD_DisplayImage_Filename: args[1],
            },
          };
        case "LI":
          type = "ChangeLED";
          data = {
            fields: {
              FIELD_ChangeLED: [args[1], args[2], args[3]],
            },
          };
        case "AU":
          type = "PlayAudio";
          data = {
            fields: {
              FIELD_PlayAudio_Filename: args[1],
            },
          };
        case "DIS":
          type = "DisplayText";
          data = {
            fields: {
              FIELD_DisplayText_Text: args[1],
            },
          };
        case "MA":
          type = "MoveArms2";
          data = {
            fields: {
              FIELD_MoveArm_LeftPosition: args[1],
              FIELD_MoveArm_LeftVelocity: args[2],
              FIELD_MoveArm_RightPosition: args[3],
              FIELD_MoveArm_RightVelocity: args[4],
            },
          };
        case "MH":
          type = "MoveHead3";
          data = {
            fields: {
              FIELD_MoveHead_Pitch: args[1],
              FIELD_MoveHead_Roll: args[2],
              FIELD_MoveHead_Yaw: args[3],
            },
          };
        case "MT":
          type = "DriveTime2";
          data = {
            fields: {
              FIELD_DriveTime_Velocity: args[1],
              FIELD_DriveTime_Angular: args[2],
              FIELD_DriveTime_TimeMs: 1000,
            },
          };
        case "SP":
          type = "Speak";
          data = {
            fields: {
              FIELD_Speak_Text: args[1],
            },
          };
      }
      useCompile(data, type);
    }
  }

  readFile("boredom.bv");
}
