class Adjoin {
  constructor(vertex) {
    // 接收顶点
    this.vertex = vertex
    // 顶点长度
    this.quantity = vertex.length
    this.init()
  }

  // 对每列执行矩阵运算
  getRowToatl(params) {
    params = params.map(id => this.getVertexRow(id));
    const adjoinNames = [];
    this.vertex.forEach((item, index) => {
      const rowtotal = params.map(value => value[index]).reduce((total, current) => {
        total += current || 0;
        return total;
      }, 0);
      adjoinNames.push(rowtotal);
    });
    return adjoinNames;
  }

  // 取交集
  getUnions(params) {
    const row = this.getRowToatl(params);
    return row.map((item, index) => item >= params.length && this.vertex[index]).filter(Boolean);
  }

  // 取并集
  getCollection(params) {
    params = this.getRowToatl(params)
    // 只要对应位置上有一个不为 0, 则保存结果，也就是并集
    return params.map((item, index) => item && this.vertex[index]).filter(Boolean);
  }

  init() {
    // 数组为顶点的两倍
    this.adjoinArray = Array.from({ length: this.quantity * this.quantity })
  }

  // 为某个定点注册边
  setAdjoinVertexs(id, sides) {
    const pIndex = this.vertex.indexOf(id)
    sides.forEach(item => {
      const index = this.vertex.indexOf(item);
      this.adjoinArray[pIndex * this.quantity + index] = 1;
    })
  }
  // 根据莫一个顶点得到一列数据 
  getVertexRow(id) {
    const index = this.vertex.indexOf(id);
    const col = [];
    this.vertex.forEach((item, pIndex) => {
      col.push(this.adjoinArray[index + this.quantity * pIndex]);
    });
    return col;
  }

  // 过滤出莫一个顶点的邻接点
  getAdjoinVertexs(id) {
    return this.getVertexRow(id).map((item, index) => {
      return item ? this.vertex[index] : ''
    }).filter(item => !!item)
  }
}

// 结合业务场景创建邻接矩阵
export default class ShopAdjoin extends Adjoin {
  constructor(commoditySpecs, data) {
    // 所有条件都有顶点
    const vertex = commoditySpecs.reduce((total, current) => [
      ...total,
      ...current.list
    ], [])
    // 组合矩阵
    super(vertex)
    // 调用父节点函数构造邻接矩阵
    this.commoditySpecs = commoditySpecs
    this.data = data
    // 创建矩阵
    this.initCommodity()
    // 获得所有的选项，也就是取交，并集的过程
    this.initSimilar()
  }

  initCommodity() {
    this.data.forEach((item) => {
      this.applyCommodity(item.specs);
    });
  }

  initSimilar() {
    // 获得所有可选项
    const specsOption = this.getCollection(this.vertex);
    this.commoditySpecs.forEach((item) => {
      const params = [];
      item.list.forEach((value) => {
        if (specsOption.indexOf(value) > -1) params.push(value);
      });
      // 同级点位创建
      this.applyCommodity(params);
    });
  }

  querySpecsOptions(params) {
    // 判断是否存在选项填一个
    if (params.some(Boolean)) {
      // 过滤一下选项
      params = this.getUnions(params.filter(Boolean));
    } else {
      // 如果未指定选项，则应包含全部的选项
      params = this.getCollection(this.vertex);
    }
    return params;
  }

  applyCommodity(params) {
    params.forEach((param) => {
      this.setAdjoinVertexs(param, params);
    });
  }
}