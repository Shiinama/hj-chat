import { Button, Checkbox } from "@fruits-chain/react-native-xiaoshu";
import { useDeepCompareEffect } from "ahooks";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getFilters } from "../../../api/setting";
import CheckIcon from "../../../assets/images/press_no_icon.svg";
import CheckedIcon from "../../../assets/images/press_yes_icon.svg";
// import { StatusBar } from 'expo-status-bar'
import XIcon from "../../../assets/images/setting/x.svg";
import useFilterStore from "../../../components/setting/Filter/filterStore";
import { useTranslations } from "../../../hooks/useTranslations";

export interface FiltersProps {}

const nameMap = {
  function: "tagId",
  language: "languageId",
};
const Filters: FC<FiltersProps> = () => {
  const { filterValue } = useFilterStore();
  const { setState } = useFilterStore;

  const [current, setCurrent] = useState(filterValue);
  useDeepCompareEffect(() => {
    setCurrent(filterValue);
  }, [filterValue, setCurrent]);
  const navigation = useNavigation();
  const router = useRouter();
  const t = useTranslations("workshop");
  const { top, bottom } = useSafeAreaInsets();
  const [filterList, setFilterList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getFilters().then((res) => {
        // 获取到数据格式化
        const resList = [];
        for (const key in res) {
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            const item = res[key];
            resList.push({
              title: t(key),
              name: nameMap?.[key] || key,
              children: item?.map((v) => ({ ...v, name: t(v?.name) })),
            });
          }
        }

        setFilterList(resList);
      });
    }, []),
  );

  useEffect(() => {
    navigation.setOptions({
      header: () => {
        return null;
      },
    });
  }, []);
  const allSelectVal = useMemo(() => {
    const res = {};
    filterList?.forEach((v) => {
      res[v?.name] = v?.children?.map((item) => item?.id);
    });
    return res;
  }, [filterList]);

  const itemClick = (name, key) => {
    if (
      !current?.[name] ||
      current?.[name]?.findIndex((filterItem) => filterItem === key) === -1
    ) {
      addFilter(name, key);
    } else {
      removeFilter(name, key);
    }
  };
  const addFilter = (name, key) => {
    // all type 的情况
    if (key === -2) {
      setCurrent(allSelectVal);
      return false;
    }
    setCurrent({
      ...(current || {}),
      [name]: [...(current?.[name] || []), key],
    });
  };
  const removeFilter = (name, key) => {
    // all type 的情况
    if (key === -2) {
      setCurrent({});
      return false;
    }
    setCurrent({
      ...(current || {}),
      [name]: [...(current?.[name]?.filter((v) => v !== key) || [])],
    });
  };

  return (
    <View style={[styles.page, { paddingTop: top, paddingBottom: bottom }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <XIcon />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.body}>
        {filterList?.map((v, i) => {
          return (
            <View style={styles.filterType} key={i}>
              <View>
                <Text style={styles.filterTypeTitle}>{v?.title}</Text>
              </View>
              <View>
                {v?.children?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      style={styles.filterTypeItem}
                      key={index}
                      onPress={() => {
                        itemClick(v?.name, item?.id);
                      }}
                    >
                      <View style={styles.filterTypeItemLeft}>
                        <Checkbox
                          value={
                            current?.[v?.name] &&
                            current?.[v?.name]?.findIndex(
                              (filterItem) => filterItem === item?.id,
                            ) !== -1
                          }
                          onChange={(checked) => {
                            if (checked) {
                              addFilter(v?.name, item?.id);
                            } else {
                              removeFilter(v?.name, item?.id);
                            }
                          }}
                          style={styles.filterTypeCheckbox}
                          renderIcon={({ active, onPress }) => {
                            return active ? (
                              <CheckedIcon onPress={onPress} />
                            ) : (
                              <CheckIcon onPress={onPress} />
                            );
                          }}
                        />
                        <Text style={styles.filterTypeLabel}>{item?.name}</Text>
                      </View>
                      <Text style={styles.filterTypeCount}>{item?.count}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.bar}>
        <Button
          size="l"
          onPress={() => {
            setState({ filterValue: current });
            router.back();
          }}
        >
          <Text style={styles.btnText}>Save</Text>
        </Button>
      </View>
    </View>
  );
};
export default Filters;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    height: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  header: {
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 24,
    color: "#1F1F1F",
    fontWeight: "bold",
  },
  body: {
    flexGrow: 1,
    flexShrink: 1,
    paddingTop: 16,
  },
  filterType: {
    borderWidth: 1,
    borderColor: "#EDEDED",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterTypeTitle: {
    fontSize: 14,
    color: "#1F1F1F",
    fontWeight: "700",
    marginBottom: 16,
  },
  filterTypeItem: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  filterTypeItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterTypeCount: {
    fontSize: 14,
    color: "#B9B9B9",
    fontWeight: "400",
  },
  filterTypeCheckbox: {
    marginRight: 16,
  },
  filterTypeLabel: {
    fontSize: 14,
    color: "#1F1F1F",
    fontWeight: "500",
  },
  bar: {
    flexGrow: 0,
    flexShrink: 0,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
