## 工具概要
本工具主要有兩種使用情境：
*  比對並找出兩份 JSON 檔案中，具有相同 Key 但 Value 不同的部分
    * 針對這個部分本工具會將其標註並且匯出成一份 JSON 檔案進行人工挑選，進行挑選完成後，藉由本工具將挑選後的內容替換至指定的 JSON 檔案中。
*  選擇一份主要的 JSON 檔案以及一份欲替換的 JSON 檔案，本工具將替換相同 Key 但 Value 不同的部分

## 執行環境 & 安裝至全域環境
> 請先確保您具有運行 [node.js](https://nodejs.org/en/) 的環境。

以下有兩種安裝方式，擇一即可：
 * 操作 Command-Line 並切換到本專案資料夾下，執行 `npm link` 將本工具安裝至全域環境
 * 運行本專案資料夾下的 `install.bat` ，將本工具安裝置全域環境

## 初次使用
當全域安裝完成時，操作 Command-Line 輸入 `jcmp` 進行環境的初始化，此時根據作業系統的不同：
* 若為 Windows 系統將在文件 (documents) 資料夾下建立必要檔案，如：
    * `jsonCompare_input` - 在這裡放入任何想透過工具轉換的檔案
    * `jsonCompare_output` - 工具執行後的結果將輸出在這裡
    * `jsonCompare_config.env` - 工具的設定檔，請填妥這份檔案，工具才能正常運行
* 非 Windows 系統將在家目錄下建立如剛才說明的三個必要檔案，在此就不贅述。

## 範例
這個段落將演示本工具的兩種使用情境，以利使用者了解。

### 情境一
首先各別準備 `a.json` 、 `b.json` 檔案並放入 `jsonCompare_input` 中，這兩份檔案的內容如下：

**a.json**
```json
{
    "animals": {
		"redAnimal": "dog",
		"blueAnimal": "cat",
        "greenAnimal": "monkey",
        "pinkAnimal": "pig"
    },
    "fruits": {
		"redFruit": "Add worker node",
		"blueFruit": "Cluster name",
		"greenFruit": "Cluster Template"
	}
}
```

**b.json**
```json
{
    "animals": {
		"redAnimal": "bird",
		"blueAnimal": "pig",
		"greenAnimal": "monkey"
    },
    "user": {
		"icon": "aaa",
		"logo": "bbb",
		"notice": "monkey"
    }
}
```

**接著設定 `jsonCompare_config.env` 如下：**
```
// 要比較的對象 A
COMPARE_FILE_A=a.json
// 要比較的對象 B
COMPARE_FILE_B=b.json
// 標記 A 便於瞭解資料來自何處
COMPARE_MARK_A=from_A
// 標記 B 便於瞭解資料來自何處
COMPARE_MARK_B=from_B
// 完成比較後輸出的檔案名稱
OUTPUT_FILE_NAME=A_B_en_diff.json


// 檔案是否需要進行 Parse ，若上個階段使用本工具輸出則為 true ，單純 Replace 則為 false
NEEDPARSE=true
// 進行 parse 後輸出的檔案名稱 (若不需要 parse 則此設定無用)
PARSED_FILE_NAME=
// 原始檔案名稱
ORIGIN_FILE_NAME=
// 取代檔案名稱
REPLACE_FILE_NAME=
// 完成 Replace 後輸出的檔案名稱
OUTPUT_REPLACE_FILE_NAME=
```

操作 Command-Line 執行 `jcmp --compare` ，結果將輸出至 `jsonCompare_output` ，此範例輸出如下結果：

**A_B_en_diff.json**
```json
{
    "animals": {
        "redAnimal": {
            "from_A": "dog",
            "from_B": "bird"
        },
        "blueAnimal": {
            "from_A": "cat",
            "from_B": "pig"
        }
    }
}
```

> 因為 a.json 、 b.json 檔案最外層的 Key 只有 `animals` 是相同的，而下一層的 Key ，兩份檔案中符合 `相同 Key 但 Value 不同` 這個條件的只有 `redAnimal` 以及 `blueAnimal` ，所以這個輸出結果可說是符合我們預期。

接著進入人工挑選的環節，以剛才的輸出檔案為例，我挑選完之後儲存成 `A_B_en_diff_picked.json`：

**A_B_en_diff_picked.json**
```json
{
    "animals": {
        "redAnimal": {
            "from_B": "bird"
        },
        "blueAnimal": {
            "from_A": "cat"
        }
    }
}
```
僅需移除不想要的來源即可，甚至可以把 `from_B` 改成其他的內容都不會影響下一階段結果，只要不修改到用來辨識的 Key 就沒問題。

**別忘了將挑選完的檔案放入 `jsonCompare_input`**


**於 `jsonCompare_config.env` 中補齊剩下的設定**
```
// 要比較的對象 A
COMPARE_FILE_A=a.json
// 要比較的對象 B
COMPARE_FILE_B=b.json
// 標記 A 便於瞭解資料來自何處
COMPARE_MARK_A=from_A
// 標記 B 便於瞭解資料來自何處
COMPARE_MARK_B=from_B
// 完成比較後輸出的檔案名稱
OUTPUT_FILE_NAME=A_B_en_diff.json


// 檔案是否需要進行 Parse ，若上個階段使用本工具輸出則為 true ，單純 Replace 則為 false
NEEDPARSE=true
// 進行 parse 後輸出的檔案名稱 (若不需要 parse 則此設定無用)
PARSED_FILE_NAME=A_B_en_diff_picked_parsed.json
// 原始檔案名稱
ORIGIN_FILE_NAME=a.json
// 取代檔案名稱
REPLACE_FILE_NAME=A_B_en_diff_picked.json
// 完成 Replace 後輸出的檔案名稱
OUTPUT_REPLACE_FILE_NAME=A_covered.json
```

在這裡我把原始檔案名稱設定為 `a.json` 並將剛才挑選完的檔案設定為要取代的檔案名稱，並且 `NEEDPARSE` 設定為 `true` ，所以 `PARSED_FILE_NAME` 這裡必須填入希望輸出的檔案名稱，這隻檔案將會移除剛才為了分辨資料來源而打上的標記，如 `form_A` 。

再次操作 Command-Line 執行 `jcmp --replace` ，結果將輸出至 `jsonCompare_output` ，此範例輸出如下結果：

**A_B_en_diff_picked_parsed.json**
```json
{
    "animals": {
        "redAnimal": "bird",
        "blueAnimal": "cat"
    }
}
```

**A_covered.json**
```json
{
    "animals": {
        "redAnimal": "bird",
        "blueAnimal": "cat",
        "greenAnimal": "monkey",
        "pinkAnimal": "pig"
    },
    "fruits": {
        "redFruit": "Add worker node",
        "blueFruit": "Cluster name",
        "greenFruit": "Cluster Template"
    }
}
```

### 情境二
與情境一不同的是，情境二為單純的替換相同 Key 但 Value 不同的部分，同樣的我們準備 `a.json` 、 `b.json` 檔案並放入 `jsonCompare_input` 中，這兩份檔案的內容如下：

**a.json**
```json
{
    "animals": {
		"redAnimal": "dog",
		"blueAnimal": "cat",
        "greenAnimal": "monkey",
        "pinkAnimal": "pig"
    },
    "fruits": {
		"redFruit": "Add worker node",
		"blueFruit": "Cluster name",
		"greenFruit": "Cluster Template"
	}
}
```

**b.json**
```json
{
    "animals": {
		"redAnimal": "bird",
		"blueAnimal": "pig",
		"greenAnimal": "monkey"
    },
    "user": {
		"icon": "aaa",
		"logo": "bbb",
		"notice": "monkey"
    }
}
```

**`jsonCompare_config.env` 的設定**
```
// 要比較的對象 A
COMPARE_FILE_A=
// 要比較的對象 B
COMPARE_FILE_B=
// 標記 A 便於瞭解資料來自何處
COMPARE_MARK_A=
// 標記 B 便於瞭解資料來自何處
COMPARE_MARK_B=
// 完成比較後輸出的檔案名稱
OUTPUT_FILE_NAME=


// 檔案是否需要進行 Parse ，若上個階段使用本工具輸出則為 true ，單純 Replace 則為 false
NEEDPARSE=false
// 進行 parse 後輸出的檔案名稱 (若不需要 parse 則此設定無用)
PARSED_FILE_NAME=
// 原始檔案名稱
ORIGIN_FILE_NAME=a.json
// 取代檔案名稱
REPLACE_FILE_NAME=b.json
// 完成 Replace 後輸出的檔案名稱
OUTPUT_REPLACE_FILE_NAME=a_covered.json
```

操作 Command-Line 執行 `jcmp --replace` ，結果將輸出至 `jsonCompare_output` ，此範例輸出如下結果：

**a_covered.json**
```json
{
    "animals": {
        "redAnimal": "bird",
        "blueAnimal": "pig",
        "greenAnimal": "monkey",
        "pinkAnimal": "pig"
    },
    "fruits": {
        "redFruit": "Add worker node",
        "blueFruit": "Cluster name",
        "greenFruit": "Cluster Template"
    }
}
```

## 工具移除
以下有兩種移除方式，擇一即可：
 * 操作 Command-Line 並切換到本專案資料夾下，執行 `npm unlink` 將本工具從全域環境移除
 * 運行本專案資料夾下的 `remove.bat` ，將本工具從全域環境移除