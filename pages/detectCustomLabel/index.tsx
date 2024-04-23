import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam"
import axios from "axios";
import { Data } from "../api/detectCustomLabels";
import { FaceListData } from "../api/collections";

const WIDTH = 320 * 1.5;
const HEIGHT = 240 * 1.5;

type Attendance = {
  name: string,
  isAttendance: boolean
}[]

const useApp = () => {
  const webcamRef = useRef<Webcam>(null);
  const [img, setImg] = useState<string | null>(null);
  const [result, setResult] = useState<Data>();
  const [attendanceList, setAttendanceList] = useState<Attendance>([])

  const capture = useCallback(async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      const img = screenshot.split(",")[1];
      const res = await axios.post<Data>("/api/detectCustomLabels", {
        img: img,
      });

      console.log(res.data);

      setResult(res.data);
      setImg(screenshot);
    }
  }, [webcamRef]);

  return { webcamRef, capture, img, result, attendanceList, setAttendanceList };
};

export const App = () => {
  const { webcamRef, capture, } = useApp();

  return (
    <div>
      <header className="flex-wrap bg-teal-500 text-white p-6 mb-6">
        <h1>お〜いお茶の検出</h1>
      </header>

      <div style={{ display: "flex" }}>
        <div>
          <div className="mb-6">
            <Webcam
              audio={false}
              width={WIDTH}
              height={HEIGHT}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
          </div>
          <div className="flex justify-center">
            <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded" onClick={capture}>お〜いお茶か検出</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
