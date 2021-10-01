<template>
  <div></div>
</template>

<script>
export default {
  name: 'test',
  data: function() {
    let mapObj;
    return {
      return: {
        data: [
          {
            'cat_id': 1,
            'cat_name': '大家电',
            'cat_pid': 0,
            'cat_level': 0,
            'cat_deleted': false,
            'children': [
              {
                'cat_id': 3,
                'cat_name': '电视',
                'cat_pid': 1,
                'cat_level': 1,
                'cat_deleted': false,
                'children': [
                  {
                    'cat_id': 6,
                    'cat_name': '曲面电视',
                    'cat_pid': 3,
                    'cat_level': 2,
                    'cat_deleted': false
                  },
                  {
                    'cat_id': 7,
                    'cat_name': '海信',
                    'cat_pid': 3,
                    'cat_level': 2,
                    'cat_deleted': false
                  }
                ]
              }
            ]
          }
        ],
        var mapObj = {
          value: 'code',
          label: 'name',
          children: 'list'
        }
      }
    }
  },
  methods: {
    converTree (tree, map) {
      const result = []
      tree.forEach((item) => {
        // 读取 map 的键值映射
        let value = item[ map.value ]
        let label = item[ map.label ]
        let children = item[ map.children ]
        // 如果有子节点，递归
        if (children) {
          children = converTree(children, map)
        }
        result.push({ value, label, children })
      })
      return result
    }
  }
}

</script>

<style scoped>

</style>
