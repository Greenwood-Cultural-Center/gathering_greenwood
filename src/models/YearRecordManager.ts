import type { YearRecord, YearData } from "./YearRecord";
import { EventEmitter } from "./EventEmitter";

export class YearRecordManager {
  private _record: YearRecord;
  private _selectedKey: string;
  public readonly onSelectionChange = new EventEmitter<string>();

  constructor(record: YearRecord, selectedKey: string) {
    if (!(selectedKey in record)) {
      throw new Error(`Selected key "${selectedKey}" not found in record.`);
    }

    this._record = record;
    this._selectedKey = selectedKey;
  }

  get record(): YearRecord {
    return this._record;
  }

  get selected(): YearData {
    return this._record[this._selectedKey];
  }

  get selectedKey(): string {
    return this._selectedKey;
  }

  set selectedKey(key: string) {
    if (!(key in this._record)) {
      throw new Error(`Invalid selection key: ${key}`);
    }
    this._selectedKey = key;
    this.onSelectionChange.emit(key);
  }

  get summary(): YearData {
    return this._record["summary-range"];
  }
}