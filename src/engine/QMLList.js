function QMLList(meta) {
  const list = [];
  if (meta.object instanceof Array) {
    for (const i in meta.object) {
      list.push(construct({
        object: meta.object[i],
        parent: meta.parent,
        context: meta.context
      }));
    }
  } else if (meta.object instanceof QMLMetaElement) {
    list.push(construct({
      object: meta.object,
      parent: meta.parent,
      context: meta.context
    }));
  }

  return list;
}
QMLList.plainType = true;
QmlWeb.qmlList = QMLList;
