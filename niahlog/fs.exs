defmodule FS do
  def pad(num) do
    num
    |> to_str
    |> String.rjust(6)
  end

  def to_str(num) do
    try do
      Integer.to_string num
    rescue _e in ArgumentError ->
        num
        |> Float.to_char_list([decimals: 3, compact: true])
        |> Kernel.to_string
    end
  end
end


IO.puts inspect System.argv
[size|_] = System.argv
{size, _} = Integer.parse size
IO.puts """
For a line height of #{size}px :

rows        #{FS.pad(1)} #{FS.pad(2)} #{FS.pad(3)} #{FS.pad(4)} #{FS.pad(5)}
height      #{FS.pad(1 * size)} #{FS.pad(2 * size)} #{FS.pad(3 * size)} #{FS.pad(4 * size)} #{FS.pad(5 * size)}

rows        #{FS.pad(0.5)} #{FS.pad(1.5)} #{FS.pad(2.5)} #{FS.pad(3.5)} #{FS.pad(4.5)} #{FS.pad(5.5)}
height      #{FS.pad(0.5 * size)} #{FS.pad(1.5 * size)} #{FS.pad(2.5 * size)} #{FS.pad(3.5 * size)} #{FS.pad(4.5 * size)} #{FS.pad(5.5 * size)}
"""
System.halt(0)

