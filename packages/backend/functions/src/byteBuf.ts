class ByteBuf {
  private buffer = Buffer.alloc(1024);
  private position = 0;

  constructor() {
    this.buffer.fill(0);
  }

  public pack() {
    const out = Buffer.alloc(this.position);
    this.buffer.copy(out, 0, 0, out.length);
    return out;
  }

  private putUint16(value: number) {
    this.buffer.writeUInt16LE(value, this.position);
    this.position += 2;
    return this;
  }

  public putUint32(value: number) {
    this.buffer.writeUInt32LE(value, this.position);
    this.position += 4;
    return this;
  }

  private putBytes(bytes: Buffer) {
    this.putUint16(bytes.length);
    bytes.copy(this.buffer, this.position);
    this.position += bytes.length;
    return this;
  }

  public putString(str: ArrayBuffer | SharedArrayBuffer) {
    return this.putBytes(Buffer.from(str));
  }

  public putTreeMapUInt32(map: { [key: number]: number }) {
    if (!map) {
      this.putUint16(0);
      return this;
    }

    this.putUint16(Object.keys(map).length);
    for (const key in map) {
      this.putUint16(Number(key));
      this.putUint32(map[key]);
    }

    return this;
  }
}

export default ByteBuf;
