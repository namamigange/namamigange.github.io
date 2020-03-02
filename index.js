var labelType, useGradients, nativeTextSupport, animate;
(function() {
  var ua = navigator.userAgent,
    iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
    typeOfCanvas = typeof HTMLCanvasElement,
    nativeCanvasSupport =
      typeOfCanvas == "object" || typeOfCanvas == "function",
    textSupport =
      nativeCanvasSupport &&
      typeof document.createElement("canvas").getContext("2d").fillText ==
        "function";
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType =
    !nativeCanvasSupport || (textSupport && !iStuff) ? "Native" : "HTML";
  nativeTextSupport = labelType == "Native";
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text) {
    console.log(text);
  }
};

function init() {
  //init data
  var json = {
    id: "NAMAM",
    name: "Namami Gange",
    data: {
      a: "310",
      c: "116",
      p: "56",
      t: "32",
      ai: "6"
    },
    children: [
      {
        id: "SEWA",
        name: "Sewage Infrastructure",
        data: {
          a: "153",
          c: "46",
          p: "75",
          t: "28",
          ai: "3"
        },
        children: [
          {
            id: "SEWA-1",
            name: "STP Capacity Creation",
            data: {
              a: "152",
              c: "46",
              p: "75",
              t: "1",
              ai: "3"
            }
          },
          {
            id: "SEWA-2",
            name: "Laying Sewer Network",
            data: {
              a: "1",
              c: "0",
              p: "0",
              t: "1",
              ai: "0"
            }
          }
        ]
      },
      {
        id: "BIOR",
        name: "Bioremediation",
        data: {
          a: "15",
          c: "0",
          p: "15",
          t: "0",
          ai: "0"
        }
      },
      {
        id: "IIHL",
        name: "Construction of IHHL near Ganga River",
        data: {
          a: "1",
          c: "0",
          p: "1",
          t: "0",
          ai: "0"
        }
      },
      {
        id: "ENTR",
        name: "Entry Level Activities",
        data: {
          a: "75",
          c: "50",
          p: "23",
          t: "2",
          ai: "0"
        },
        children: [
          {
            id: "ENTR-1",
            name: "Ghats/Kunds/Crematoria Craetion",
            data: {
              a: "70",
              c: "50",
              p: "18",
              t: "2",
              ai: "0"
            }
          },
          {
            id: "ENTR-2",
            name: "River Front Development Projects",
            data: {
              a: "1",
              c: "0",
              p: "1",
              t: "0",
              ai: "0"
            }
          },
          {
            id: "ENTR-3",
            name: "Ghats Cleaning",
            data: {
              a: "3",
              c: "0",
              p: "3",
              t: "0",
              ai: "0"
            }
          },
          {
            id: "ENTR-4",
            name: "River Surface Cleaning",
            data: {
              a: "1",
              c: "0",
              p: "1",
              t: "0",
              ai: "0"
            }
          }
        ]
      },
      {
        id: "CETF",
        name: "CETF & Ganga Mitra",
        data: {
          a: "4",
          c: "2",
          p: "2",
          t: "0",
          ai: "0"
        }
      },
      {
        id: "PUBL",
        name: "Public Support/Outreach",
        data: {
          a: "13",
          c: "5",
          p: "6",
          t: "0",
          ai: "2"
        }
      },
      {
        id: "INST",
        name: "Institutional Development",
        data: {
          a: "20",
          c: "1",
          p: "17",
          t: "1",
          ai: "1"
        },
        children: [
          {
            id: "INST-1",
            name: "Ganga Knoledge Center",
            data: {
              a: "6",
              c: "1",
              p: "4",
              t: "0",
              ai: "1"
            }
          },
          {
            id: "INST-2",
            name: "Ganga Monitoring Center",
            data: {
              a: "1",
              c: "0",
              p: "1",
              t: "0",
              ai: "0"
            }
          },
          {
            id: "INST-3",
            name: "Central Pollution Control board",
            data: {
              a: "12",
              c: "0",
              p: "11",
              t: "1",
              ai: "0"
            }
          },
          {
            id: "INST-4",
            name: "Disctrict Ganga Committtee",
            data: {
              a: "1",
              c: "0",
              p: "1",
              t: "0",
              ai: "0"
            }
          }
        ]
      },
      {
        id: "BIOD",
        name: "Biodiversity Conservation",
        data: {
          a: "8",
          c: "2",
          p: "6",
          t: "0",
          ai: "0"
        }
      },
      {
        id: "AFFO",
        name: "Afforestation",
        data: {
          a: "21",
          c: "10",
          p: "11",
          t: "0",
          ai: "0"
        }
      }
    ]
  };
  //end
  var infovis = document.getElementById("infovis");
  var w = infovis.offsetWidth - 50,
    h = infovis.offsetHeight - 50;

  //init Hypertree
  var ht = new $jit.Hypertree({
    //id of the visualization container
    injectInto: "infovis",
    //canvas width and height
    width: w,
    height: h,
    //Change node and edge styles such as
    //color, width and dimensions.
    Node: {
      dim: 60,
      color: "#FF9933"
    },
    Edge: {
      lineWidth: 2,
      color: "#138808"
    },
    onBeforeCompute: function(node) {
      Log.write("centering..");
    },
    //Attach event handlers and add text to the
    //labels. This method is only triggered on label
    //creation
    onCreateLabel: function(domElement, node) {
      domElement.innerHTML = node.name;
      $jit.util.addEvent(domElement, "click", function() {
        ht.onClick(node.id, {
          onComplete: function() {
            ht.controller.onComplete();
          }
        });
      });
    },
    //Change node styles when labels are placed
    //or moved.
    onPlaceLabel: function(domElement, node) {
      var style = domElement.style;
      style.display = "";
      style.cursor = "pointer";
      if (node._depth == 0) {
        style.fontSize = "1em";
        style.color = "#000080";
        style["font-weight"] = "800";
      } else if (node._depth == 1) {
        style.fontSize = "0.8em";
        style["font-weight"] = "500";
        style.color = "#000080";
      } else if (node._depth == 2) {
        style.fontSize = "0.6em";
        style["font-weight"] = "100";
        style.color = "#000080";
      } else {
        style.display = "none";
      }

      var left = parseInt(style.left);
      var w = domElement.offsetWidth;
      style.left = left - w / 2 + "px";
    },

    onComplete: function() {
      Log.write("done");
      var node = ht.graph.getClosestNodeToOrigin("current");
      console.log(node.data);
      $(".status-a .value").html(node.data.a)
      $(".status-c .value").html(node.data.c)
      $(".status-p .value").html(node.data.p)
      $(".status-t .value").html(node.data.t)
      $(".status-ai .value").html(node.data.ai)
    }
  });
  //load JSON data.
  ht.loadJSON(json);
  //compute positions and plot.
  ht.refresh();
  //end
  ht.controller.onComplete();
}
