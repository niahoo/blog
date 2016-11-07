# blog

This is my blog.
It uses metalsmith (currently migrating).

Building on windows requires Visual Studio 2013 and [this file](http://unicode.org/Public/UNIDATA/UnicodeData.txt) stored as `C:\usr\shared\unicode\UnicodeData.txt` (or another location)

``` win
npm rm unicode
set NODE_UNICODETABLE_UNICODEDATA_TXT=C:\usr\share\unicode\UnicodeData.txt
npm install

```
