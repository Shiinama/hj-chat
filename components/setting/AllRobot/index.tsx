import { useDeepCompareEffect } from "ahooks";
import { FC, useState } from "react";
import { View } from "react-native";

import Filter from "../Filter";
import useFilterStore from "../Filter/filterStore";
import RobotList from "../RobotList";
import SearchInput from "../SearchInput";

export interface AllRobotProps {}
const AllRobot: FC<AllRobotProps> = () => {
  const [params, setParams] = useState<any>({});
  const { filterValue } = useFilterStore();

  useDeepCompareEffect(() => {
    const nameObj = params?.name ? { name: params?.name } : {};
    if (filterValue?.type?.includes(-2)) {
      setParams(nameObj);
    } else {
      const filterParams = {};
      let tgSupported = {};
      for (const key in filterValue) {
        if (Object.prototype.hasOwnProperty.call(filterValue, key)) {
          let item = filterValue[key];
          if (key === "type") {
            tgSupported = item?.includes(-1) ? { tgSupported: 1 } : {};
            item = item?.filter((v) => v !== -1).join();
          }
          if (item?.length > 0) {
            filterParams[key] = item?.join();
          }
        }
      }
      setParams({ ...nameObj, ...(filterParams || {}), ...tgSupported });
    }
  }, [filterValue]);
  return (
    <>
      <View style={{ paddingHorizontal: 16 }}>
        <SearchInput
          value={params?.name}
          onChange={(keyword) => {
            setParams({ ...params, name: keyword });
          }}
        />
      </View>
      <RobotList requestParams={params} />
      <Filter />
    </>
  );
};
export default AllRobot;
